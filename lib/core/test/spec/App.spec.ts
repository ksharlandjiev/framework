import { expect } from 'chai'
import { App } from '../../src'
import { Container } from '@exteranto/ioc'
import { Dispatcher, Event } from '@exteranto/events'
import { Provider, Script } from '@exteranto/support'
import { WindowLoadedEvent, AppBootedEvent } from '../../src'

describe('App Class should', () => {
  let dispatcher

  before(() => {
    dispatcher = Container.resolve(Dispatcher)
  })

  afterEach(() => {
    (dispatcher as any).events = {}
  })

  it('register base container parameters', () => {
    const app: App = new App(Script.BACKGROUND, { providers: [] }, () => {})
    app.start()
    app.boot()

    expect(Container.resolveParam('browser')).to.be.ok
    expect(Container.resolveParam('script')).to.equal(Script.BACKGROUND)
  })

  it('find providers', () => {
    const app: App = new App(Script.BACKGROUND, { providers: [TestProvider] }, () => {})
    app.start()
    app.boot()

    expect((app as any).providers).to.have.lengthOf(1)
  })

  it('boot providers', () => {
    const app: App = new App(Script.BACKGROUND, { providers: [TestProvider] }, () => {})
    app.start()
    app.boot()

    expect(Container.resolveParam('test')).to.equal('test')
  })

  it('register providers', () => {
    const app: App = new App(Script.BACKGROUND, { providers: [TestProvider] }, () => {})
    app.start()
    app.boot()

    expect(Container.resolveParam('test2')).to.equal('test2')
  })

  it('register param bindings', () => {
    const app: App = new App(Script.BACKGROUND, { providers: [], bound: { param: 'exteranto' } }, () => {})
    app.start()
    app.boot()

    expect(Container.resolveParam('param')).to.equal('exteranto')
  })

  it('register events', (done) => {
    const app: App = new App(
      Script.BACKGROUND,
      { providers: [] },
      touch => touch(<typeof Event> TestEvent).addHook((_: TestEvent) => done())
    )

    app.start()
    app.boot()

    dispatcher.fire(new TestEvent())
  })

  it('fire the app booted event', (done) => {
    const app: App = new App(
      Script.BACKGROUND,
      { providers: [] },
      touch => touch(AppBootedEvent).addHook((event: AppBootedEvent) => {
        try {
          expect(event).to.be.instanceOf(AppBootedEvent)
          done()
        } catch (e) { done(e) }
      })
    )
    app.start()
    app.boot()
  })

  it('register the window load event', (done) => {
    const app: App = new App(
      Script.BACKGROUND,
      { providers: [] },
      touch => touch(WindowLoadedEvent).addHook((event: WindowLoadedEvent) => {
        try {
          expect(event).to.be.instanceOf(WindowLoadedEvent)
          done()
        } catch (e) { done(e) }
      })
    )
    app.start()
    app.boot()
  })
})

class TestProvider extends Provider {

  boot () : void {
    this.container.bindParam('test', 'test')
  }

  register () : void {
    this.container.bindParam('test2', 'test2')
  }
}

class TestEvent extends Event {
  //
}
