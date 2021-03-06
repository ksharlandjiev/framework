import { CookieChangedEvent } from '../events'
import { Cookies as AbstractCookies } from '../Cookies'
import { EmptyResponseException } from '@internal/exceptions'
import { Dispatcher, RegistersNativeEvents } from '@exteranto/core'
import { InvalidCookieRequestException } from '@internal/cookies/exceptions'

import LastError = chrome.runtime.LastError

export class Cookies extends AbstractCookies implements RegistersNativeEvents {

  /**
   * {@inheritdoc}
   */
  public get (url: string, name: string) : Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.cookies.get({ url, name }, (cookie) => {
        const error: LastError = chrome.runtime.lastError

        if (error) {
          return reject(new InvalidCookieRequestException(error.message))
        }

        cookie === null
          ? reject(new EmptyResponseException())
          : resolve(cookie)
      })
    })
  }

  /**
   * {@inheritdoc}
   */
  public getAll (params?: any) : Promise<any[]> {
    return new Promise((resolve, reject) => {
      chrome.cookies.getAll(params, (cookies) => {
        const error: LastError = chrome.runtime.lastError

        error
          ? reject(new InvalidCookieRequestException(error.message))
          : resolve(cookies)
      })
    })
  }

  /**
   * {@inheritdoc}
   */
  public set (params?: any) : Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.cookies.set(params, () => {
        const error: LastError = chrome.runtime.lastError

        error
          ? reject(new InvalidCookieRequestException(error.message))
          : resolve()
      })
    })
  }

  /**
   * {@inheritdoc}
   */
  public registerEvents (dispatcher: Dispatcher) : void {
    chrome.cookies.onChanged.addListener((cookie) => {
      dispatcher.fire(new CookieChangedEvent(cookie))
    })
  }

}
