import { Subject } from 'rxjs';

const subject = new Subject();

export const messageService = {
    sendMessage: message => subject.next({ text: message }),
    clearMessages: () => subject.next(),
    getMessage: () => subject.asObservable()
};
// import { BehaviorSubject } from 'rxjs';

// const subscriber = new BehaviorSubject(0);

// const messageService = {
//     sendMessage: function (message) { subscriber.next(message); },
//     getMessage: () => subscriber.asObservable()
// }

// export {
//     messageService,
//     subscriber
// }