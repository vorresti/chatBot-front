export default class Bot {
  constructor() {
    this.weather = [
      'It`s too cold today!',
      'The weather is warm :))',
      'Hot like in hell!!!',
      'Raining... so wet in the street',
    ];
    this.virus = [
      'Stay home - virus is everywhere!!!',
      'Today +6568 infected... it`s a shitty',
      'The virus is retreating in Europe! Isn`t all so bad?',
      'Don`t give up! This is temporary...',
    ];
    this.cinema = [
      'Try "Love The Hard Way"',
      'May be you don`t see "The King`s Speech"',
      '"Vicky Cristina Barcelona" - I advice you to whatch it',
    ];
    this.music = [
      'The day to listen "Queen"',
      'My recommendation is Müslüm Maqomayev',
      'What`s about "Scorpions"?',
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
        answer = this.randomAnswer(this.weather);
        break;
      case 'virus':
        answer = this.randomAnswer(this.virus);
        break;
      case 'cinema':
        answer = this.randomAnswer(this.cinema);
        break;
      case 'music':
        answer = this.randomAnswer(this.music);
        break;
      case 'book':
        answer = this.randomAnswer(this.books);
        break;
      default:
        answer = 'Sorry, I don`t know what to say... Command is not correct';
        break;
    }
    return answer;
  }

  randomAnswer(answersArray) {
    this.randomIndex = Math.floor(Math.random() * answersArray.length);
    return answersArray[this.randomIndex];
  }
}
