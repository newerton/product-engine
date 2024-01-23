import { KafkaServerConfig } from '@core/@shared/infrastructure/config/env';

describe('KafkaServerConfig', () => {
  it('should be defined', () => {
    expect(KafkaServerConfig).toBeDefined();
  });

  it('should have KAFKA_REPLICA_COUNT', () => {
    expect(KafkaServerConfig.KAFKA_REPLICA_COUNT).toBeDefined();
    expect(KafkaServerConfig.KAFKA_REPLICA_COUNT).toEqual(
      Number(process.env.KAFKA_REPLICA_COUNT),
    );
  });

  it('should have KAFKA_BROKER_0_HOST', () => {
    expect(KafkaServerConfig.KAFKA_BROKER_0_HOST).toBeDefined();
    expect(KafkaServerConfig.KAFKA_BROKER_0_HOST).toEqual(
      process.env.KAFKA_BROKER_0_HOST,
    );
  });

  it('should have KAFKA_BROKER_0_PORT', () => {
    expect(KafkaServerConfig.KAFKA_BROKER_0_PORT).toBeDefined();
    expect(KafkaServerConfig.KAFKA_BROKER_0_PORT).toEqual(
      Number(process.env.KAFKA_BROKER_0_PORT),
    );
  });

  it('should have KAFKA_BROKER_1_HOST', () => {
    expect(KafkaServerConfig.KAFKA_BROKER_1_HOST).toBeDefined();
    expect(KafkaServerConfig.KAFKA_BROKER_1_HOST).toEqual(
      process.env.KAFKA_BROKER_1_HOST,
    );
  });

  it('should have KAFKA_BROKER_1_PORT', () => {
    expect(KafkaServerConfig.KAFKA_BROKER_1_PORT).toBeDefined();
    expect(KafkaServerConfig.KAFKA_BROKER_1_PORT).toEqual(
      Number(process.env.KAFKA_BROKER_1_PORT),
    );
  });

  it('should have KAFKA_BROKER_2_HOST', () => {
    expect(KafkaServerConfig.KAFKA_BROKER_2_HOST).toBeDefined();
    expect(KafkaServerConfig.KAFKA_BROKER_2_HOST).toEqual(
      process.env.KAFKA_BROKER_2_HOST,
    );
  });

  it('should have KAFKA_BROKER_2_PORT', () => {
    expect(KafkaServerConfig.KAFKA_BROKER_2_PORT).toBeDefined();
    expect(KafkaServerConfig.KAFKA_BROKER_2_PORT).toEqual(
      Number(process.env.KAFKA_BROKER_2_PORT),
    );
  });

  it('should have brokers', () => {
    expect(KafkaServerConfig.brokers()).toBeDefined();
    expect(KafkaServerConfig.brokers()).toEqual([
      `${process.env.KAFKA_BROKER_0_HOST}:${process.env.KAFKA_BROKER_0_PORT}`,
      `${process.env.KAFKA_BROKER_1_HOST}:${process.env.KAFKA_BROKER_1_PORT}`,
      `${process.env.KAFKA_BROKER_2_HOST}:${process.env.KAFKA_BROKER_2_PORT}`,
    ]);
  });
});
