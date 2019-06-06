const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');

// initialize all dependencies
require('./parser');
require('./utils');

const {buildTemplate} = require('./utils');
const {gather} = require('./parser');


const bot = new Telegraf('851271459:AAFPXVM21Kagx7n94H-O7IIY0GQUI02gHqw');

bot.use(Telegraf.log());

bot.start((ctx) => ctx.reply('Для начала диалога вам следует поздороваться! 😜'));

// bot.hears( /\w+|[а-я]+/g ,async ({reply}) => {
//   reply(`Чтобы вызвать меню, напишите в чат слово "меню". 😉`);
// });

bot.hears(/привет|здравствуйте|здравствуй|меню|hi|hello|yo/i, ({ reply, from}) => {
    return reply(`Привет, ${from.first_name}! Я помогу вам найти подходящую квартиру!🤪 Пожалуйста выберите нужную вам опцию.👇`, 
    Markup
      .keyboard([
        ['⏱ Поиск за день', '⏲ Поиск за неделю', '⏳ Поиск за месяц'],
        ['⛔ Расширенный поиск', '🚑 Помощь']
      ])
      .oneTime()
      .resize()
      .extra()
    )
});

bot.hears('⏱ Поиск за день', async ({reply, replyWithPhoto}) => {
  const accomodation = await gather(1);
  buildTemplate(accomodation, reply, replyWithPhoto);
});

bot.hears('⏲ Поиск за неделю', async ({reply, replyWithPhoto}) => {
  const accomodation = await gather(7);
  buildTemplate(accomodation, reply, replyWithPhoto);
});

bot.hears('⏳ Поиск за месяц', async ({reply, replyWithPhoto}) => {
  const accomodation = await gather(30);
  buildTemplate(accomodation, reply, replyWithPhoto);
});

bot.hears('⛔ Расширенный поиск', async ({reply}) => {
  return reply('Опция пока недоступна. В процесе разработки...');
});

bot.hears('🚑 Помощь', async ({reply}) => {
  return reply('Для начала поиска поприветствуйте бота написав "Привет". Поиск осуществляется по городу Минску. Диапазон цены от 45 тыс. до 90 тыс. долларов. Дом не старше 2000 года. Поиск осуществляется по квартирам расположенным только на последнем этаже.');
});

bot.launch();
