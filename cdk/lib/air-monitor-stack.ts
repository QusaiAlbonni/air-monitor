import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as mq from 'aws-cdk-lib/aws-amazonmq';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling'
import { Construct } from 'constructs';
import * as path from 'path';

export class AirMonitorStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'AirMonitorVPC', {
      maxAzs: 2,
      natGateways: 1,
    });

    const dbSecurityGroup = new ec2.SecurityGroup(this, 'DBSecurityGroup', { vpc });
    
    const database = new rds.DatabaseInstance(this, 'PostgresDB', {
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_16 }),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      securityGroups: [dbSecurityGroup],
      databaseName: 'airmonitor',
      credentials: rds.Credentials.fromGeneratedSecret('airmonitor'), // Auto-generates password
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT for production
    });


    const mqSecurityGroup = new ec2.SecurityGroup(this, 'MQSecurityGroup', { vpc });

    const brokerUser = 'airmonitor';
    const brokerPass = 'airMonitorSecurePass123!'; // Ideally from SecretsManager

    const broker = new mq.CfnBroker(this, 'RabbitMQBroker', {
      brokerName: 'AirMonitorBroker',
      engineType: 'RABBITMQ',
      engineVersion: '3.13',
      deploymentMode: 'SINGLE_INSTANCE', // Use ACTIVE_STANDBY_MULTI_AZ for prod
      hostInstanceType: 'mq.t3.micro',
      publiclyAccessible: false,
      users: [{
        username: brokerUser,
        password: brokerPass,
      }],
      subnetIds: [vpc.privateSubnets[0].subnetId],
      securityGroups: [mqSecurityGroup.securityGroupId],
    });

    const cluster = new ecs.Cluster(this, 'AirMonitorCluster', { vpc });

    const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'ASG', {
      vpc,
      instanceType: new ec2.InstanceType('t3.small'),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
      minCapacity: 1,
      maxCapacity: 2,
    });
    
    const capacityProvider = new ecs.AsgCapacityProvider(this, 'AsgCapacityProvider', {
      autoScalingGroup,
    });
    cluster.addAsgCapacityProvider(capacityProvider);

    const rabbitMqUrl = `amqp://${brokerUser}:${brokerPass}@${broker.attrAmqpEndpoints}`;

    const collectorTask = new ecs.Ec2TaskDefinition(this, 'CollectorTask', {
      networkMode: ecs.NetworkMode.AWS_VPC,
    });

    const collectorContainer = collectorTask.addContainer('CollectorContainer', {
      image: ecs.ContainerImage.fromAsset(path.join(__dirname, '..', 'apps', 'collector-service')),
      memoryLimitMiB: 256,
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'collector' }),
      environment: {
        NODE_ENV: 'production',
        RABBITMQ: rabbitMqUrl, 
        QUEUE_NAME: 'alert_queue',
        PORT: '3001',
      },
    });

    collectorContainer.addPortMappings({ containerPort: 3001 });

    const collectorService = new ecs.Ec2Service(this, 'CollectorService', {
      cluster,
      taskDefinition: collectorTask,
      desiredCount: 1,
    });

    const processorTask = new ecs.Ec2TaskDefinition(this, 'ProcessorTask', {
      networkMode: ecs.NetworkMode.AWS_VPC,
    });

    const processorContainer = processorTask.addContainer('ProcessorContainer', {
      image: ecs.ContainerImage.fromAsset(path.join(__dirname, '..', 'apps', 'processor-service')),
      memoryLimitMiB: 256,
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'processor' }),
      environment: {
        NODE_ENV: 'production',
        DATABASE_URL: `postgres://airmonitor:${database.secret?.secretValueFromJson('password').unsafeUnwrap()}@${database.dbInstanceEndpointAddress}:${database.dbInstanceEndpointPort}/airmonitor`,
        RABBITMQ: rabbitMqUrl,
        QUEUE_NAME: 'alert_queue',
        PORT: '3000',
      },
    });

    processorContainer.addPortMappings({ containerPort: 3000 });

    const processorService = new ecs.Ec2Service(this, 'ProcessorService', {
      cluster,
      taskDefinition: processorTask,
      desiredCount: 1,
    });

    database.connections.allowFrom(processorService, ec2.Port.tcp(5432));
    
    mqSecurityGroup.addIngressRule(collectorService.connections.securityGroups[0], ec2.Port.tcp(5672), 'Allow Collector');
    mqSecurityGroup.addIngressRule(processorService.connections.securityGroups[0], ec2.Port.tcp(5672), 'Allow Processor');
  }
}