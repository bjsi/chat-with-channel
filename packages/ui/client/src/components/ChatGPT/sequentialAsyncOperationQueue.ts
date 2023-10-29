interface QueueItem<T> {
  action: () => Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
}

export class SequentialAsyncOperationQueue<T> {
  _pendingPromise: boolean = false;
  _items: QueueItem<T>[] = [];

  enqueue(action: () => Promise<T>) {
    return new Promise((resolve, reject) => {
      this._items.push({ action, resolve, reject });
      this.dequeue();
    });
  }

  async dequeue() {
    if (this._pendingPromise) return false;

    let item = this._items.shift();

    if (!item) return false;

    try {
      this._pendingPromise = true;

      let payload = await item.action();

      this._pendingPromise = false;
      item.resolve(payload);
    } catch (e) {
      this._pendingPromise = false;
      item.reject(e);
    } finally {
      this.dequeue();
    }

    return true;
  }
}
