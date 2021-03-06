

import AWS from 'aws-sdk'
import * as chai from 'chai'
import remove from './action'

const expect = chai.expect

describe('delete webhook', () => {
    const id = '123'
    const data = { subject: "list", subjectId: "1", event: "subscribe", webhook: "update-test1.com/webhook", userID: 'abc-123', createdAt: 'day1', updatedAt: 'day1' }

    const successConnection = function () {
        return {
            delete: () => ({
                    promise: async () => data
                })
        }
    }

    const failureConnection = function () {
        return {
            delete: () => ({
                    promise: async () => { throw 'error' }
                })
        }
    }

    describe('#delete()', () => {

        context('when the event is valid a webhook is deleted', () => {
            before(() => {
                AWS.DynamoDB.DocumentClient = successConnection
            })

            it('should delete a webhook', async () => {
                const webhook = await remove(id)

                expect(webhook).to.have.property('subject')
                expect(webhook.subject).to.be.equal('list')
                expect(webhook).to.have.property('subjectId')
                expect(webhook.subjectId).to.be.equal('1')
                expect(webhook).to.have.property('event')
                expect(webhook.event).to.be.equal('subscribe')
                expect(webhook).to.have.property('webhook')
                expect(webhook.webhook).to.be.equal('update-test1.com/webhook')
                expect(webhook).to.have.property('userID')
                expect(webhook.userID).to.be.equal('abc-123')
                expect(webhook).to.have.property('createdAt')
                expect(webhook.createdAt).to.be.equal('day1')
                expect(webhook).to.have.property('updatedAt')
                expect(webhook.updatedAt).to.be.equal('day1')
            })
        })

        context('when connection goes wrong, an error should be thrown', () => {
            before(() => {
                AWS.DynamoDB.DocumentClient = failureConnection
            })

            it('should throw an error', async () => {
                try {
                    await remove(id)
                } catch (e) {
                    expect(e).to.equal('error')
                }
            })
        })
    })
})