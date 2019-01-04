import { register } from './events'
import { Dispatcher } from '@exteranto/events'
import { Runtime as AbstractRuntime } from '../Runtime'
import { InvalidUrlFormatException } from '@exteranto/exceptions'

export class Runtime extends AbstractRuntime {
  /**
   * @inheritdoc
   */
  public setUninstallUrl (url: string) : Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.runtime.setUninstallURL(url, () => {
        const error: any = chrome.runtime.lastError

        error
          ? reject(new InvalidUrlFormatException(error.message))
          : resolve()
      })
    })
  }

  /**
   * @inheritdoc
   */
  public extensionUrl (path: string = '') : string {
    return chrome.runtime.getURL(path)
  }

  /**
   * @inheritdoc
   */
  public registerEvents (dispatcher: Dispatcher) : void {
    register(dispatcher)
  }
}