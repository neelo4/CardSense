export type MockRequest<T> = {
  latency?: number;
  jitter?: number;
  transform?: (payload: T) => T;
};

export async function simulateNetwork<T>(payload: T, options: MockRequest<T> = {}): Promise<T> {
  const { latency = 450, jitter = 250, transform } = options;
  const wait = latency + Math.random() * jitter;

  await new Promise((resolve) => setTimeout(resolve, wait));

  return transform ? transform(payload) : payload;
}

export async function simulateMutation<T>(mutator: () => T | Promise<T>, delay = 380) {
  await new Promise((resolve) => setTimeout(resolve, delay));
  return mutator();
}
