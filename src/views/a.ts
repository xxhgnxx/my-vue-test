type PromiseStatus = 'pending' | 'fulfilled' | 'rejected';

class ControllablePromise<T> {
  private _status: PromiseStatus = 'pending';

  constructor(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
    this.promise = new Promise((resolve, reject) => {
      executor(resolve, reject);
    });

    this.promise.then(() => {
      this._status = 'fulfilled';
    }).catch(() => {
      this._status = 'rejected';
    });
  }

  public get status(): PromiseStatus {
    return this._status;
  }

  public resolve(value: T | PromiseLike<T>): void {
    if (this._status === 'pending') {
      this._status = 'fulfilled';
      this._resolve(value);
    }
  }

  public reject(reason?: any): void {
    if (this._status === 'pending') {
      this._status = 'rejected';
      this._reject(reason);
    }
  }

  public readonly promise: Promise<T>;

  private _resolve!: (value: T | PromiseLike<T>) => void;

  private _reject!: (reason?: any) => void;
}
