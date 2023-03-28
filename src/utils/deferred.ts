type Fn = (...args: any[]) => void;
export default class Deferred<T> {
  isCompleted: boolean;

  resolved: boolean;

  resolve: Fn | null;

  promise;

  then;

  constructor() {
    this.isCompleted = false;
    this.resolved = false;
    this.resolve = null;
    this.promise = new Promise<T>((resolve) => {
      this.resolve = (...args) => {
        if (this.resolved) {
          return;
        }
        this.isCompleted = true;
        this.resolved = true;
        (resolve as Fn).call(this, ...args);
      };
    });
    this.then = this.promise.then.bind(this.promise);
  }
}
