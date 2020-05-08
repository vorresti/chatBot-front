export default class Bot {
  constructor() {
    this.weather = [
      'So much cold today!', 'The weather is warm :))',
      'The sun is shining like fire!',
      'Raining... so wet in the street',
    ];
    this.virus = [
      'Stay home - virus wherever!!!',
      'Today +6568 infected... it`s a shitty',
      'In Europe the virus is retreating! Maybe all is not so bad?',
      'Don`t give up! This is temporary...',
    ];
    this.cinema = [
      'Try "Love The Hard Way"',
      'May be you don`t see "The King`s Speech"',
      '"Vicky Cristina Barcelona" - I advise you to whath it',
    ];
    this.music = [
      'The day to listen "Queen"',
      'My recommendation is Müslüm Maqomayev',
      'What about "Scorpions"?',
      'Love drums? Steve Gadd is just for you!',
    ];
    this.books = [
      '"JavaScript for kids" - have you read it?',
      '"Vanishing Girls" - from detective stories...',
      'Fantasy? No problem - "The Lies of Locke Lamora"',
      '"Introduction to Algorithms by Thomas H. Corman" - it calls "must read"!',
    ];
    this.randomIndex = null;
  }

  getAnswer(message) {
    let answer = '';
    const question = message.replace(/^@chaos: /, '');

    switch (question) {
      case 'weather':
        answer = this.randomMsg(this.weather);
        break;
      case 'virus':
        answer = this.randomMsg(this.virus);
        break;
      case 'cinema':
        answer = this.randomMsg(this.cinema);
        break;
      case 'music':
        answer = this.randomMsg(this.music);
        break;
      case 'book':
        answer = this.randomMsg(this.books);
        break;
      default:
        answer = 'Sorry, I don`t know what to say...';
        break;
    }
    return answer;
  }

  randomMsg(answersArray) {
    this.randomIndex = Math.floor(Math.random() * answersArray.length);
    return answersArray[this.randomIndex];
  }
}
