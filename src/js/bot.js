/* eslint-disable class-methods-use-this */
// function convertDate(value) {
//   const rValue = value < 10 ? `0${value}` : value;
//   return rValue;
// }

// function printData(valueDate) {
//   const itemDate = new Date(valueDate);
//   const date = convertDate(itemDate.getDate());
//   const month = convertDate(itemDate.getMonth() + 1);
//   const year = convertDate(itemDate.getFullYear());
//   const hours = convertDate(itemDate.getHours());
//   const minut = convertDate(itemDate.getMinutes());
//   // const second = convertDate(itemDate.getSeconds());
//   const itemCreated = `${hours}:${minut} ${date}.${month}.${year}`;
//   return itemCreated;
// }

export default class Bot {
  // constructor(parentEl) {
  //   this.weather = ['За окном солнечно', 'Не забудьте взять зонтик', 'Температура за бортом +20', 'Дождь со снегом целый день', 'Жарко. Очень жарко', 'Сегодня -10'];
  //   this.toGo = ['В кино сегодня много интересного!', 'В солнечный денек лучше провести время на природе', 'Сходите с любимым человеком в ресторан', 'Посидите дома, за окном дождь'];
  //   this.likeYou = ['Лучше всех!', 'Грустно(', 'Все хорошо! А как ты', 'Бывало и получше', 'Теперь стало намного лучше'];
  //   this.whatSee = ['Мультфильмы по Карусели', 'Боевичок со Сталоне', 'Ужастики лучше не смотреть перед сном', 'Балет - Либидиное озеро', 'Сказку про колобка', 'Мыльную оперу', 'Сходи в театрт'];
  //   this.howTime = ['Почитать книжку', 'Написать програмку', 'Убраться в комнате', 'Хорошенько выспаться', 'Пригласить друзей в гости', 'Съездить в путешествие', 'Сходи в театрт'];
  //   this.parentEl = parentEl;
  // }
  constructor() {
    this.weather = [
      'So much cold today!', 'The weather is warm :))',
      'The sun is shining like fire!',
      'Raining... so wet in the street'
    ];
    this.virus = [
      'Stay home - virus wherever!!!',
      'Today +6568 infected... it`s a shitty',
      'In Europe the virus is retreating! Maybe all is not so bad?',
      'Don`t give up! This is temporary...'
    ];
    this.cinema = [
      'Try "Love The Hard Way"',
      'May be you don`t see "The King`s Speech"',
      '"Vicky Cristina Barcelona" - I advise you to whath it'
    ];
    this.music = [
      'The day to listen "Queen"',
      'My recommendation is Müslüm Maqomayev',
      'What about "Scorpions"?',
      'Love drums? Steve Gadd is just for you!'
    ];
    this.books = [
      '"JavaScript for kids" - have you read it?',
      '"Vanishing Girls" - from detective stories...',
      'Fantasy? No problem - "The Lies of Locke Lamora"',
      '"Introduction to Algorithms by Thomas H. Corman" - it calls "must read"!'
    ];
  }

  getAnswer(message) {
    let answer = '';
    // let elItemMsg = document.createElement('div');
    // elItemMsg.className = 'item-message';
    // elItemMsg.innerHTML = `
    // ${msg}
    // <div class="footer-msg">
    //   <div class="date-time">${printData(new Date())}</div>
    // </div>
    // `;
    // this.parentEl.appendChild(elItemMsg);

    const question = message.replace(/^@chaos: /, '');
    // console.log(zapros);
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
    // console.log(msgHtml);
    return answer;
    // elItemMsg = document.createElement('div');
    // elItemMsg.className = 'item-message bot';
    // elItemMsg.innerHTML = `
    // ${msgHtml}
    // <div class="footer-msg">
    //   <div class="date-time">${printData(new Date())}</div>
    // </div>
    // `;
    // this.parentEl.appendChild(elItemMsg);
  }

  randomMsg(answersArray) {
    // console.log(arr);
    const randomIndex = Math.floor(Math.random() * answersArray.length);
    // console.log(randomIndex);
    return answersArray[randomIndex];
  }
}
