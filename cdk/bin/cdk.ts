#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { CdkStack } from '../lib/cdk-stack';
import { AirMonitorStack } from '../lib/air-monitor-stack';

const app = new cdk.App();
new AirMonitorStack(app, 'AirMonitorStack', {});
