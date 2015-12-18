/** @jsx createElement */
/* eslint-env mocha */
import chai, {expect} from 'chai'
import {createElement, Phrase} from 'lacona-phrase'
import {text} from './_util'
import { Parser, Error as LaconaError } from '..'

describe('reconcile', () => {
  let parser

  beforeEach(() => {
    parser = new Parser()
  })

  it('throws for phrases without a default-lang schema', () => {
    class Test extends Phrase {}
    Test.translations = [{
      langs: ['en-US'],
      describe() {
        return <literal text='whatever' />
      }
    }]

    parser.grammar = <Test />

    expect(() => parser.reconcile()).to.throw(LaconaError)
  })

  it('throws for translations without a lang', () => {
    class Test extends Phrase {}
    Test.translations = [{
      describe () {
        return <literal text='whatever' />
      }
    }]

    parser.grammar = <Test />

    expect(() => parser.reconcile()).to.throw(LaconaError)
  })

  it('throws for translations without a describe', () => {
    class Test extends Phrase {}
    Test.translations = [{
      lang: ['default']
    }]

    parser.grammar = <Test />

    expect(() => parser.reconcile()).to.throw(LaconaError)
  })

  it('throws for root grammars with invalid elements', () => {
    const Test = undefined

    parser.grammar = <Test />

    expect(() => parser.reconcile()).to.throw(LaconaError)
  })

  it('throws for phrase grammars with invalid elements', () => {
    const Invalid = undefined

    class Test extends Phrase {
      describe () {
        return <Invalid />
      }
    }

    parser.grammar = <Test />

    expect(() => parser.reconcile()).to.throw(LaconaError)
  })

  it('throws for phrase grammars that do not extend Phrase', () => {
    class Test {
      describe () {}
    }

    parser.grammar = <Test />

    expect(() => parser.reconcile()).to.throw(LaconaError)
  })

  it('throws for sources that do not extend Phrase', () => {
    class TestSource {
      onCreate () {
        console.log(3)
      }
    }
    class Test extends Phrase {
      source () {return {test: <TestSource  />}}
      describe () {
        return <literal text='test' />
      }
    }

    parser.grammar = <Test />

    expect(() => parser.reconcile()).to.throw(LaconaError)
  })
})
