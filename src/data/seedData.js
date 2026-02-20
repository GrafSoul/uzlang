export const seedTopics = [
  {
    key: 'store',
    title: 'Покупки в магазине',
    description: 'Продукты, цены, оплата, вежливые вопросы.'
  },
  {
    key: 'bazaar',
    title: 'Базар: овощи и фрукты',
    description: 'Торг, количество, свежесть, просьбы.'
  },
  {
    key: 'city',
    title: 'Поездка по городу',
    description: 'Маршрутка, такси, остановка, направление.'
  },
  {
    key: 'neighbors',
    title: 'Соседи и погода',
    description: 'Бытовое общение во дворе и дома.'
  },
  {
    key: 'family',
    title: 'Поздравления и семья',
    description: 'Кто родился, поздравления, теплые фразы.'
  },
  {
    key: 'pharmacy',
    title: 'Аптека и здоровье',
    description: 'Покупка лекарств, симптомы, базовые вопросы.'
  },
  {
    key: 'clinic',
    title: 'Поликлиника и запись',
    description: 'Регистрация, очередь, время приема.'
  },
  {
    key: 'cafe',
    title: 'Кафе и чайхана',
    description: 'Заказ, состав блюда, оплата счета.'
  },
  {
    key: 'housing',
    title: 'Аренда жилья и быт',
    description: 'Квартира, коммуналка, поломки, хозяин.'
  },
  {
    key: 'taxi',
    title: 'Такси: продвинутые кейсы',
    description: 'Пробки, ожидание, смена маршрута, точки.'
  },
  {
    key: 'transport',
    title: 'Общественный транспорт',
    description: 'Пересадки, линии, остановки, проезд.'
  },
  {
    key: 'work',
    title: 'Работа и офис',
    description: 'График, встречи, задачи и документы.'
  },
  {
    key: 'bank',
    title: 'Банк и платежи',
    description: 'Карта, перевод, комиссия, баланс.'
  },
  {
    key: 'school',
    title: 'Детский сад и школа',
    description: 'Расписание, учитель, собрания, справки.'
  },
  {
    key: 'repair',
    title: 'Сервис и ремонт',
    description: 'Ремонт техники и сроки выполнения.'
  },
  {
    key: 'delivery',
    title: 'Почта и доставка',
    description: 'Адрес, курьер, самовывоз, оплата.'
  },
  {
    key: 'documents',
    title: 'Госуслуги и документы',
    description: 'Регистрация, справки, подпись и окна.'
  }
];

export const topicImageByKey = {
  store: '/images/store.svg',
  bazaar: '/images/bazaar.svg',
  city: '/images/city.svg',
  neighbors: '/images/neighbors.svg',
  family: '/images/family.svg',
  pharmacy: '/images/store.svg',
  clinic: '/images/city.svg',
  cafe: '/images/bazaar.svg',
  housing: '/images/neighbors.svg',
  taxi: '/images/city.svg',
  transport: '/images/city.svg',
  work: '/images/city.svg',
  bank: '/images/store.svg',
  school: '/images/family.svg',
  repair: '/images/store.svg',
  delivery: '/images/bazaar.svg',
  documents: '/images/city.svg'
};

const baseSeedCards = [
  {
    topicKey: 'store',
    imageUrl: topicImageByKey.store,
    uz: 'Assalomu alaykum',
    reading: 'ассалому алайкум',
    ru: 'Здравствуйте',
    exampleUz: 'Assalomu alaykum, non bormi?',
    exampleRu: 'Здравствуйте, хлеб есть?'
  },
  {
    topicKey: 'store',
    imageUrl: topicImageByKey.store,
    uz: 'Qancha turadi?',
    reading: 'канча туради',
    ru: 'Сколько стоит?',
    exampleUz: 'Bu sut qancha turadi?',
    exampleRu: 'Сколько стоит это молоко?'
  },
  {
    topicKey: 'store',
    imageUrl: topicImageByKey.store,
    uz: 'Arzonroq bering',
    reading: 'арзонрок беринг',
    ru: 'Дайте дешевле',
    exampleUz: 'Iloji bo‘lsa, arzonroq bering.',
    exampleRu: 'Если можно, дайте дешевле.'
  },
  {
    topicKey: 'store',
    imageUrl: topicImageByKey.store,
    uz: 'Karta qabul qilasizmi?',
    reading: 'карта қабул қиласизми',
    ru: 'Принимаете карту?',
    exampleUz: 'Karta qabul qilasizmi yoki faqat naqdmi?',
    exampleRu: 'Принимаете карту или только наличные?'
  },
  {
    topicKey: 'store',
    imageUrl: topicImageByKey.store,
    uz: 'Yaroqlilik muddati qachongacha?',
    reading: 'яроклилик муддати качонгача',
    ru: 'Какой срок годности?',
    exampleUz: 'Bu yogurtning yaroqlilik muddati qachongacha?',
    exampleRu: 'Какой срок годности у этого йогурта?'
  },
  {
    topicKey: 'store',
    imageUrl: topicImageByKey.store,
    uz: 'Yana bitta paket bering',
    reading: 'яна битта пакет беринг',
    ru: 'Дайте еще один пакет',
    exampleUz: 'Iltimos, yana bitta paket bering.',
    exampleRu: 'Пожалуйста, дайте еще один пакет.'
  },
  {
    topicKey: 'store',
    imageUrl: topicImageByKey.store,
    uz: 'Qaytim bering, iltimos',
    reading: 'кайтим беринг илтимос',
    ru: 'Дайте сдачу, пожалуйста',
    exampleUz: 'Menga qaytim bering, iltimos.',
    exampleRu: 'Дайте мне сдачу, пожалуйста.'
  },
  {
    topicKey: 'store',
    imageUrl: topicImageByKey.store,
    uz: 'Chegirma bormi?',
    reading: 'чегирма борми',
    ru: 'Есть скидка?',
    exampleUz: 'Shu mahsulotga chegirma bormi?',
    exampleRu: 'На этот товар есть скидка?'
  },
  {
    topicKey: 'bazaar',
    imageUrl: topicImageByKey.bazaar,
    uz: 'Yangi meva bormi?',
    reading: 'янги мева борми',
    ru: 'Есть свежие фрукты?',
    exampleUz: 'Yangi olma va nok bormi?',
    exampleRu: 'Есть свежие яблоки и груши?'
  },
  {
    topicKey: 'bazaar',
    imageUrl: topicImageByKey.bazaar,
    uz: 'Bir kilo bering',
    reading: 'бир кило беринг',
    ru: 'Дайте один килограмм',
    exampleUz: 'Pomidordan bir kilo bering.',
    exampleRu: 'Дайте килограмм помидоров.'
  },
  {
    topicKey: 'bazaar',
    imageUrl: topicImageByKey.bazaar,
    uz: 'Yaxshisini tanlab bering',
    reading: 'яхшисини танлаб беринг',
    ru: 'Выберите получше',
    exampleUz: 'Iltimos, yaxshisini tanlab bering.',
    exampleRu: 'Пожалуйста, выберите получше.'
  },
  {
    topicKey: 'bazaar',
    imageUrl: topicImageByKey.bazaar,
    uz: 'Yarim kilo ham bo‘ladimi?',
    reading: 'ярим кило хам булади ми',
    ru: 'Можно полкило?',
    exampleUz: 'Pomidorlardan yarim kilo ham bo‘ladimi?',
    exampleRu: 'Можно полкило помидоров?'
  },
  {
    topicKey: 'bazaar',
    imageUrl: topicImageByKey.bazaar,
    uz: 'Tarozida tortib bering',
    reading: 'тарозида тортиб беринг',
    ru: 'Взвесьте на весах',
    exampleUz: 'Iltimos, tarozida tortib bering.',
    exampleRu: 'Пожалуйста, взвесьте на весах.'
  },
  {
    topicKey: 'bazaar',
    imageUrl: topicImageByKey.bazaar,
    uz: 'Bu juda qimmat ekan',
    reading: 'бу жуда киммат экан',
    ru: 'Это очень дорого',
    exampleUz: 'Aka, bu juda qimmat ekan, arzonroq qiling.',
    exampleRu: 'Это очень дорого, сделайте дешевле.'
  },
  {
    topicKey: 'bazaar',
    imageUrl: topicImageByKey.bazaar,
    uz: 'Mayli, ikki kilo oling',
    reading: 'майли икки кило олинг',
    ru: 'Ладно, возьму два кило',
    exampleUz: 'Mayli, olmalardan ikki kilo oling.',
    exampleRu: 'Ладно, возьму два кило яблок.'
  },
  {
    topicKey: 'city',
    imageUrl: topicImageByKey.city,
    uz: 'Bekat qayerda?',
    reading: 'бекат қаерда',
    ru: 'Где остановка?',
    exampleUz: 'Shu avtobus bekati qayerda?',
    exampleRu: 'Где эта автобусная остановка?'
  },
  {
    topicKey: 'city',
    imageUrl: topicImageByKey.city,
    uz: 'Shahar markaziga boradimi?',
    reading: 'шаҳар марказига борадими',
    ru: 'Едет в центр города?',
    exampleUz: 'Bu marshrutka shahar markaziga boradimi?',
    exampleRu: 'Эта маршрутка едет в центр?'
  },
  {
    topicKey: 'city',
    imageUrl: topicImageByKey.city,
    uz: 'Shu yerda tushaman',
    reading: 'шу ерда тушаман',
    ru: 'Я выхожу здесь',
    exampleUz: 'Rahmat, shu yerda tushaman.',
    exampleRu: 'Спасибо, я выхожу здесь.'
  },
  {
    topicKey: 'city',
    imageUrl: topicImageByKey.city,
    uz: 'Taksiga tezroq borishim kerak',
    reading: 'таксига тезрок боришим керак',
    ru: 'Мне нужно быстрее доехать на такси',
    exampleUz: 'Ishga kech qoldim, taksiga tezroq borishim kerak.',
    exampleRu: 'Я опаздываю на работу, нужно быстрее доехать на такси.'
  },
  {
    topicKey: 'city',
    imageUrl: topicImageByKey.city,
    uz: 'Manzilga qancha vaqtda yetamiz?',
    reading: 'манзилга канча вактда етамиз',
    ru: 'За сколько доедем до адреса?',
    exampleUz: 'Markazdagi manzilga qancha vaqtda yetamiz?',
    exampleRu: 'За сколько доедем до адреса в центре?'
  },
  {
    topicKey: 'city',
    imageUrl: topicImageByKey.city,
    uz: 'Iltimos, shu ko‘chadan buriling',
    reading: 'илтимос шу кочадан бурилинг',
    ru: 'Пожалуйста, поверните на этой улице',
    exampleUz: 'Iltimos, keyingi svetofordan emas, shu ko‘chadan buriling.',
    exampleRu: 'Пожалуйста, поверните на этой улице, не на следующем светофоре.'
  },
  {
    topicKey: 'city',
    imageUrl: topicImageByKey.city,
    uz: 'Hisobni ilovada to‘layman',
    reading: 'хисобни иловада тулайман',
    ru: 'Оплачу через приложение',
    exampleUz: 'Rahmat, hisobni ilovada to‘layman.',
    exampleRu: 'Спасибо, оплачу через приложение.'
  },
  {
    topicKey: 'city',
    imageUrl: topicImageByKey.city,
    uz: 'Iltimos, konditsionerni yoqing',
    reading: 'илтимос кондиционерни ёкинг',
    ru: 'Пожалуйста, включите кондиционер',
    exampleUz: 'Issiq bo‘lyapti, iltimos, konditsionerni yoqing.',
    exampleRu: 'Жарко, пожалуйста, включите кондиционер.'
  },
  {
    topicKey: 'city',
    imageUrl: topicImageByKey.city,
    uz: 'Oynani biroz ochib qo‘ysak bo‘ladimi?',
    reading: 'ойнани бироз очиб койсак булади ми',
    ru: 'Можно немного открыть окно?',
    exampleUz: 'Havo yo‘q ekan, oynani biroz ochib qo‘ysak bo‘ladimi?',
    exampleRu: 'Душно, можно немного открыть окно?'
  },
  {
    topicKey: 'city',
    imageUrl: topicImageByKey.city,
    uz: 'Shu manzilda kutib turing',
    reading: 'шу манзилда кутиб туринг',
    ru: 'Подождите по этому адресу',
    exampleUz: 'Men ikki daqiqada chiqaman, shu manzilda kutib turing.',
    exampleRu: 'Я выйду через две минуты, подождите по этому адресу.'
  },
  {
    topicKey: 'city',
    imageUrl: topicImageByKey.city,
    uz: 'Yo‘l tirband ekanmi?',
    reading: 'йол тирбанд эканми',
    ru: 'Пробка на дороге?',
    exampleUz: 'Bugun markaz tomonda yo‘l tirband ekanmi?',
    exampleRu: 'Сегодня в сторону центра пробка?'
  },
  {
    topicKey: 'city',
    imageUrl: topicImageByKey.city,
    uz: 'Aylanma yo‘ldan borsak tezroq bo‘ladimi?',
    reading: 'айланма йулдан борсак тезрок булади ми',
    ru: 'По объездной будет быстрее?',
    exampleUz: 'Aylanma yo‘ldan borsak tezroq bo‘ladimi?',
    exampleRu: 'По объездной будет быстрее?'
  },
  {
    topicKey: 'city',
    imageUrl: topicImageByKey.city,
    uz: 'Shu yerda to‘xtab turing',
    reading: 'шу ерда тохтаб туринг',
    ru: 'Остановитесь здесь',
    exampleUz: 'Do‘kon oldida, shu yerda to‘xtab turing.',
    exampleRu: 'У магазина, остановитесь здесь.'
  },
  {
    topicKey: 'neighbors',
    imageUrl: topicImageByKey.neighbors,
    uz: 'Bugun havo issiq ekan',
    reading: 'бугун ҳаво иссиқ экан',
    ru: 'Сегодня жаркая погода',
    exampleUz: 'Bugun havo issiq ekan, to‘g‘rimi?',
    exampleRu: 'Сегодня жарко, правда?'
  },
  {
    topicKey: 'neighbors',
    imageUrl: topicImageByKey.neighbors,
    uz: 'Ishlar qalay?',
    reading: 'ишлар қалай',
    ru: 'Как дела?',
    exampleUz: 'Assalomu alaykum, ishlar qalay?',
    exampleRu: 'Здравствуйте, как дела?'
  },
  {
    topicKey: 'neighbors',
    imageUrl: topicImageByKey.neighbors,
    uz: 'Uyda hamma tinchmi?',
    reading: 'уйда ҳамма тинчми',
    ru: 'Дома все в порядке?',
    exampleUz: 'Qo‘shni, uyda hamma tinchmi?',
    exampleRu: 'Сосед, дома все в порядке?'
  },
  {
    topicKey: 'neighbors',
    imageUrl: topicImageByKey.neighbors,
    uz: 'Kechqurun choyga kiring',
    reading: 'кечкирун чойга киринг',
    ru: 'Зайдите вечером на чай',
    exampleUz: 'Qo‘shni, kechqurun choyga kiring.',
    exampleRu: 'Сосед, заходите вечером на чай.'
  },
  {
    topicKey: 'neighbors',
    imageUrl: topicImageByKey.neighbors,
    uz: 'Bolalar hovlida o‘ynayapti',
    reading: 'болалар ховлида уйнаяпти',
    ru: 'Дети играют во дворе',
    exampleUz: 'Bugun bolalar hovlida o‘ynayapti.',
    exampleRu: 'Сегодня дети играют во дворе.'
  },
  {
    topicKey: 'neighbors',
    imageUrl: topicImageByKey.neighbors,
    uz: 'Ertaga suv o‘chadimi?',
    reading: 'эртага сув очадими',
    ru: 'Завтра отключат воду?',
    exampleUz: 'Qo‘shni, ertaga suv o‘chadimi?',
    exampleRu: 'Сосед, завтра отключат воду?'
  },
  {
    topicKey: 'neighbors',
    imageUrl: topicImageByKey.neighbors,
    uz: 'Yordam kerak bo‘lsa, ayting',
    reading: 'ёрдам керак болса айтинг',
    ru: 'Если нужна помощь, скажите',
    exampleUz: 'Ko‘chishda yordam kerak bo‘lsa, ayting.',
    exampleRu: 'Если нужна помощь с переездом, скажите.'
  },
  {
    topicKey: 'family',
    imageUrl: topicImageByKey.family,
    uz: 'Tabriklayman!',
    reading: 'табриклайман',
    ru: 'Поздравляю!',
    exampleUz: 'Farzandingiz tug‘ilibdi, tabriklayman!',
    exampleRu: 'У вас родился ребенок, поздравляю!'
  },
  {
    topicKey: 'family',
    imageUrl: topicImageByKey.family,
    uz: 'O‘g‘ilmi yo qizmi?',
    reading: 'ўғилми ё қизми',
    ru: 'Мальчик или девочка?',
    exampleUz: 'Yangi tug‘ilgan bola o‘g‘ilmi yo qizmi?',
    exampleRu: 'Новорожденный мальчик или девочка?'
  },
  {
    topicKey: 'family',
    imageUrl: topicImageByKey.family,
    uz: 'Baxtli bo‘linglar',
    reading: 'бахтли бўлинглар',
    ru: 'Будьте счастливы',
    exampleUz: 'Oilangiz bilan baxtli bo‘linglar.',
    exampleRu: 'Будьте счастливы с вашей семьей.'
  }
];

function createCard(topicKey, uz, ru, exampleUz = uz, exampleRu = ru) {
  return {
    topicKey,
    imageUrl: topicImageByKey[topicKey] || null,
    uz,
    reading: uz,
    ru,
    exampleUz,
    exampleRu
  };
}

const additionalCardsByTopic = {
  store: [
    ['Bu mahsulot yangi', 'Этот товар новый'],
    ['Bu mahsulot eski', 'Этот товар старый'],
    ['Bu narx qimmat', 'Эта цена высокая'],
    ['Bu narx arzon', 'Эта цена низкая'],
    ['Menga sumka kerak', 'Мне нужен пакет'],
    ['Yana bitta sumka bering', 'Дайте еще один пакет'],
    ['Qaytim bering, iltimos', 'Дайте сдачу, пожалуйста']
  ],
  bazaar: [
    ['Yarim kilo bering', 'Дайте полкило'],
    ['Ikki kilo bering', 'Дайте два килограмма'],
    ['Tarozida tortib bering', 'Взвесьте на весах'],
    ['Bu meva shirin', 'Этот фрукт сладкий'],
    ['Bu meva nordon', 'Этот фрукт кислый'],
    ['Bu sabzavot yangi', 'Этот овощ свежий'],
    ['Bu juda qimmat', 'Это очень дорого'],
    ['Mayli, olaman', 'Ладно, беру']
  ],
  city: [
    ['Yo‘l tirbandmi?', 'Есть пробка на дороге?'],
    ['Aylanma yo‘ldan borsak tezroq bo‘ladimi?', 'По объездной будет быстрее?']
  ],
  neighbors: [
    ['Kechqurun choyga kiring', 'Зайдите вечером на чай'],
    ['Bolalar hovlida o‘ynayapti', 'Дети играют во дворе'],
    ['Ertaga suv bo‘ladimi?', 'Завтра будет вода?'],
    ['Bugun shamol kuchli', 'Сегодня сильный ветер'],
    ['Bugun yomg‘ir bo‘ladimi?', 'Сегодня будет дождь?'],
    ['Yordam kerak bo‘lsa, ayting', 'Если нужна помощь, скажите'],
    ['Hamma yaxshi, rahmat', 'Все хорошо, спасибо'],
    ['Qo‘shni, savol bor', 'Сосед, есть вопрос']
  ],
  family: [
    ['Ota va ona uyda', 'Отец и мать дома'],
    ['Aka ishda, opa uyda', 'Старший брат на работе, сестра дома'],
    ['Bugun tug‘ilgan kun', 'Сегодня день рождения'],
    ['Oila bilan bayram qilamiz', 'Празднуем с семьей'],
    ['Farzand yaxshi, sog‘liq yaxshi', 'Ребенок в порядке, здоровье хорошее'],
    ['Bolaga yordam kerak', 'Ребенку нужна помощь'],
    ['O‘g‘il maktabda', 'Сын в школе'],
    ['Qiz uyda', 'Дочь дома'],
    ['Oilangizga rahmat', 'Спасибо вашей семье'],
    ['Baxt va tinchlik tilayman', 'Желаю счастья и спокойствия'],
    ['Kechqurun oila bilan choy', 'Вечером чай с семьей'],
    ['Bugun hamma birga', 'Сегодня все вместе']
  ],
  pharmacy: [
    ['Assalomu alaykum, yordam kerak', 'Здравствуйте, нужна помощь'],
    ['Menga sog‘liq uchun dori kerak', 'Мне нужно лекарство для здоровья'],
    ['Bosh og‘riq uchun dori bormi?', 'Есть лекарство от головной боли?'],
    ['Yo‘tal uchun nima bor?', 'Что есть от кашля?'],
    ['Harorat yuqori, nima qilish kerak?', 'Температура высокая, что делать?'],
    ['Bu dori qachon ichiladi?', 'Когда принимать это лекарство?'],
    ['Kuniga necha marta ichaman?', 'Сколько раз в день принимать?'],
    ['Ovqatdan oldinmi yoki keyinmi?', 'До еды или после?'],
    ['Bolaga ham bo‘ladimi?', 'Подойдет и ребенку?'],
    ['Yana arzonroq variant bormi?', 'Есть вариант дешевле?'],
    ['Retsept kerakmi?', 'Нужен рецепт?'],
    ['Karta qabul qilasizmi?', 'Принимаете карту?'],
    ['Naqd to‘lasam bo‘ladimi?', 'Можно оплатить наличными?'],
    ['Rahmat, shu dorini olaman', 'Спасибо, беру это лекарство'],
    ['Sog‘ bo‘ling', 'Будьте здоровы']
  ],
  clinic: [
    ['Assalomu alaykum, ro‘yxatga yozilmoqchiman', 'Здравствуйте, хочу записаться'],
    ['Bugun qabul bormi?', 'Сегодня есть прием?'],
    ['Shifokor qachon bo‘sh bo‘ladi?', 'Когда врач будет свободен?'],
    ['Navbat qayerda?', 'Где очередь?'],
    ['Soat nechida kiraman?', 'Во сколько я зайду?'],
    ['Menda harorat bor', 'У меня температура'],
    ['Menda yo‘tal bor', 'У меня кашель'],
    ['Menda bosh og‘riq bor', 'У меня болит голова'],
    ['Qon tahlili kerakmi?', 'Нужен анализ крови?'],
    ['Bugun natija bo‘ladimi?', 'Результат будет сегодня?'],
    ['Ma’lumotnoma berasizmi?', 'Выдадите справку?'],
    ['Keyingi qabul qachon?', 'Когда следующий прием?'],
    ['Iltimos, tezroq bo‘lsa yaxshi', 'Пожалуйста, если можно побыстрее'],
    ['Rahmat, tushundim', 'Спасибо, понял'],
    ['Xayr, salomat bo‘ling', 'До свидания, будьте здоровы']
  ],
  cafe: [
    ['Bo‘sh stol bormi?', 'Есть свободный стол?'],
    ['Menyu bering, iltimos', 'Дайте меню, пожалуйста'],
    ['Menga choy kerak', 'Мне нужен чай'],
    ['Menga osh kerak', 'Мне нужен плов'],
    ['Bu taom achchiqmi?', 'Это блюдо острое?'],
    ['Achchiq bo‘lmasa yaxshi', 'Лучше не острое'],
    ['Shakar bilan choy bering', 'Дайте чай с сахаром'],
    ['Suv ham bering', 'И воду тоже'],
    ['Yana bitta non bering', 'Дайте еще один хлеб'],
    ['Qancha turadi?', 'Сколько стоит?'],
    ['Hisobni bering, iltimos', 'Принесите счет, пожалуйста'],
    ['Karta qabul qilasizmi?', 'Принимаете карту?'],
    ['Naqd to‘layman', 'Оплачу наличными'],
    ['Hammasi yaxshi, rahmat', 'Все хорошо, спасибо'],
    ['Yana kelaman', 'Приду еще']
  ],
  housing: [
    ['Uy ijaraga kerak', 'Нужно жилье в аренду'],
    ['Bu uy katta', 'Этот дом большой'],
    ['Bu uy kichik', 'Этот дом маленький'],
    ['Manzil markazga yaqinmi?', 'Адрес близко к центру?'],
    ['Ijara narxi qancha?', 'Сколько аренда?'],
    ['Suv bor, elektr bor', 'Вода есть, электричество есть'],
    ['Bugun suv yo‘q', 'Сегодня воды нет'],
    ['Issiq suv qachon bo‘ladi?', 'Когда будет горячая вода?'],
    ['Kalit bormi?', 'Есть ключ?'],
    ['Qo‘shnilar tinchmi?', 'Соседи спокойные?'],
    ['Ta’mir kerak bo‘lsa, kimga aytamiz?', 'Если нужен ремонт, кому сказать?'],
    ['Xona toza va yaxshi', 'Комната чистая и хорошая'],
    ['Bugun ko‘rishga kelsam bo‘ladimi?', 'Можно прийти посмотреть сегодня?'],
    ['Mayli, shu uy menga mos', 'Хорошо, этот дом мне подходит'],
    ['Shartnoma qachon qilamiz?', 'Когда оформим договор?']
  ],
  taxi: [
    ['Taksi kerak, iltimos', 'Нужно такси, пожалуйста'],
    ['Manzilga tezroq boraylik', 'Давайте быстрее доедем до адреса'],
    ['Yo‘l tirband ekan', 'Похоже, на дороге пробка'],
    ['Boshqa yo‘ldan borsak bo‘ladimi?', 'Можно поехать другой дорогой?'],
    ['Aylanma yo‘l yaxshiroqmi?', 'Объездная лучше?'],
    ['Shu yerda bir daqiqa kuting', 'Подождите здесь одну минуту'],
    ['Oldin do‘konga, keyin uyga', 'Сначала в магазин, потом домой'],
    ['Yana bitta manzil bor', 'Есть еще один адрес'],
    ['Shu ko‘chadan o‘ngga buriling', 'Поверните направо на этой улице'],
    ['Keyin chapga buriling', 'Потом поверните налево'],
    ['Shu yerda to‘xtang', 'Остановитесь здесь'],
    ['Qancha bo‘ldi?', 'Сколько вышло?'],
    ['Hisobni ilovada to‘layman', 'Оплачу через приложение'],
    ['Rahmat, yaxshi haydadingiz', 'Спасибо, хорошо вели'],
    ['Xayr, yaxshi kun', 'До свидания, хорошего дня']
  ],
  transport: [
    ['Bekat qayerda?', 'Где остановка?'],
    ['Bu avtobus markazga boradimi?', 'Этот автобус едет в центр?'],
    ['Metro kirish qayerda?', 'Где вход в метро?'],
    ['Qaysi yo‘nalish kerak?', 'Какой маршрут нужен?'],
    ['Keyingi bekat qaysi?', 'Какая следующая остановка?'],
    ['Bu yerda tushaman', 'Я выхожу здесь'],
    ['Bir bekat oldin ayting', 'Скажите за одну остановку'],
    ['Qayta o‘tish kerakmi?', 'Нужна пересадка?'],
    ['Marshrutka tezroqmi?', 'Маршрутка быстрее?'],
    ['Metro sekinroq, lekin arzon', 'Метро медленнее, но дешевле'],
    ['Yo‘l haqi qancha?', 'Сколько стоит проезд?'],
    ['Karta bilan to‘lash mumkinmi?', 'Можно оплатить картой?'],
    ['Bugun transport kechikdimi?', 'Сегодня транспорт задержался?'],
    ['Rahmat, tushundim', 'Спасибо, понял'],
    ['Xayr, yaxshi yo‘l', 'До свидания, счастливого пути']
  ],
  work: [
    ['Bugun ish bor', 'Сегодня есть работа'],
    ['Soat nechida boshlaymiz?', 'Во сколько начинаем?'],
    ['Men biroz kech qolaman', 'Я немного опоздаю'],
    ['Bugun yig‘ilish bormi?', 'Сегодня есть встреча?'],
    ['Vazifa nima?', 'Какая задача?'],
    ['Hujjat tayyormi?', 'Документ готов?'],
    ['Bu ish muhim', 'Эта работа важная'],
    ['Bu ish tez kerak', 'Эта работа нужна срочно'],
    ['Men tushundim, qilaman', 'Я понял, сделаю'],
    ['Yordam kerak bo‘lsa ayting', 'Если нужна помощь, скажите'],
    ['Tanaffus qachon?', 'Когда перерыв?'],
    ['Bugun vaqt kam', 'Сегодня мало времени'],
    ['Ertaga davom etamiz', 'Завтра продолжим'],
    ['Rahmat, yaxshi ishladik', 'Спасибо, хорошо поработали'],
    ['Xayr, ertaga ko‘rishamiz', 'До свидания, увидимся завтра']
  ],
  bank: [
    ['Bank qayerda?', 'Где банк?'],
    ['Menga karta kerak', 'Мне нужна карта'],
    ['Karta ishlamayapti', 'Карта не работает'],
    ['Pul yechmoqchiman', 'Хочу снять деньги'],
    ['Pul o‘tkazmoqchiman', 'Хочу сделать перевод'],
    ['Komissiya qancha?', 'Какая комиссия?'],
    ['Balansni tekshirib bering', 'Проверьте баланс'],
    ['Naqd pul bormi?', 'Есть наличные деньги?'],
    ['Terminal ishlayaptimi?', 'Терминал работает?'],
    ['To‘lov o‘tmadi', 'Платеж не прошел'],
    ['Yana bir marta urinib ko‘raylik', 'Давайте попробуем еще раз'],
    ['Pasport kerakmi?', 'Нужен паспорт?'],
    ['Imzo qayerga qo‘yaman?', 'Где поставить подпись?'],
    ['Rahmat, hammasi tushunarli', 'Спасибо, все понятно'],
    ['Xayr, yaxshi kun', 'До свидания, хорошего дня']
  ],
  school: [
    ['Bola bog‘chada', 'Ребенок в садике'],
    ['Bola maktabda', 'Ребенок в школе'],
    ['Dars soat nechida?', 'Во сколько урок?'],
    ['Bugun ota-ona yig‘ilishi bormi?', 'Сегодня есть родительское собрание?'],
    ['Ustoz bilan gaplashmoqchiman', 'Хочу поговорить с учителем'],
    ['Uyga vazifa bormi?', 'Есть домашнее задание?'],
    ['Bola bugun sal kasal', 'Ребенок сегодня немного болеет'],
    ['Ma’lumotnoma kerak', 'Нужна справка'],
    ['Ertaga dars bo‘ladimi?', 'Завтра будут занятия?'],
    ['Sinf qayerda?', 'Где класс?'],
    ['Maktabga yaqin uy kerak', 'Нужно жилье рядом со школой'],
    ['Bola yaxshi o‘qiyapti', 'Ребенок хорошо учится'],
    ['Rahmat, ustoz', 'Спасибо, учитель'],
    ['Kechqurun qayta gaplashamiz', 'Вечером еще поговорим'],
    ['Xayr, ko‘rishguncha', 'До свидания, до встречи']
  ],
  repair: [
    ['Telefon ishlamayapti', 'Телефон не работает'],
    ['Ta’mir kerak', 'Нужен ремонт'],
    ['Qachon tayyor bo‘ladi?', 'Когда будет готово?'],
    ['Bu ish qancha turadi?', 'Сколько это стоит?'],
    ['Bugun topshirsam bo‘ladimi?', 'Можно сдать сегодня?'],
    ['Ertaga olib ketsam bo‘ladimi?', 'Можно забрать завтра?'],
    ['Kafolat bormi?', 'Есть гарантия?'],
    ['Original detal bormi?', 'Есть оригинальная деталь?'],
    ['Arzonroq variant bormi?', 'Есть вариант дешевле?'],
    ['Iltimos, tezroq qiling', 'Пожалуйста, сделайте быстрее'],
    ['Oldin tekshirib bering', 'Сначала проверьте'],
    ['Muammo nimada?', 'В чем проблема?'],
    ['Rahmat, yaxshi bo‘ldi', 'Спасибо, получилось хорошо'],
    ['To‘lovni karta bilan qilaman', 'Оплачу картой'],
    ['Xayr, yana kelaman', 'До свидания, приду снова']
  ],
  delivery: [
    ['Posilka qayerda?', 'Где посылка?'],
    ['Kuryer qachon keladi?', 'Когда приедет курьер?'],
    ['Manzilni to‘g‘ri yozdimmi?', 'Я правильно указал адрес?'],
    ['Manzilni qayta aytaman', 'Сейчас повторю адрес'],
    ['Uy oldida kuting, iltimos', 'Подождите у дома, пожалуйста'],
    ['Telefon qilsangiz yaxshi', 'Лучше позвоните'],
    ['Topshirish kodi bor', 'Есть код получения'],
    ['Olib ketish joyi qayerda?', 'Где пункт самовывоза?'],
    ['Bugun olib ketsam bo‘ladimi?', 'Можно забрать сегодня?'],
    ['To‘lov oldindan qilingan', 'Оплата сделана заранее'],
    ['Naqd to‘lasam ham bo‘ladimi?', 'Можно оплатить наличными?'],
    ['Posilka butunmi?', 'Посылка целая?'],
    ['Rahmat, oldim', 'Спасибо, получил'],
    ['Yana yetkazib berish kerak bo‘ladi', 'Еще понадобится доставка'],
    ['Xayr, yaxshi kun', 'До свидания, хорошего дня']
  ],
  documents: [
    ['Ro‘yxatdan o‘tmoqchiman', 'Хочу зарегистрироваться'],
    ['Qaysi hujjat kerak?', 'Какой документ нужен?'],
    ['Pasport nusxasi kerakmi?', 'Нужна копия паспорта?'],
    ['Aslini ham olib kelaymi?', 'Оригинал тоже принести?'],
    ['Ariza qayerda yoziladi?', 'Где заполняется заявление?'],
    ['Imzo qayerga qo‘yiladi?', 'Где ставится подпись?'],
    ['Navbat raqami qayerda?', 'Где номер очереди?'],
    ['Mening navbatim qachon?', 'Когда моя очередь?'],
    ['Bugun topshirsam bo‘ladimi?', 'Можно подать сегодня?'],
    ['Natija qachon chiqadi?', 'Когда будет результат?'],
    ['Ma’lumotnoma tayyormi?', 'Справка готова?'],
    ['Bitta nusxa bering', 'Дайте один экземпляр'],
    ['Yana qanday qog‘oz kerak?', 'Какие еще бумаги нужны?'],
    ['Rahmat, hammasi tushunarli', 'Спасибо, все понятно'],
    ['Xayr, yaxshi kun', 'До свидания, хорошего дня']
  ]
};

const additionalSeedCards = Object.entries(additionalCardsByTopic).flatMap(([topicKey, rows]) =>
  rows.map(([uz, ru, exampleUz, exampleRu]) =>
    createCard(topicKey, uz, ru, exampleUz || uz, exampleRu || ru)
  )
);

export const seedCards = [...baseSeedCards, ...additionalSeedCards];

const REQUIRED_PHRASES_PER_TOPIC = 15;
const topicCounts = seedCards.reduce((acc, card) => {
  acc[card.topicKey] = (acc[card.topicKey] || 0) + 1;
  return acc;
}, {});

seedTopics.forEach((topic) => {
  if ((topicCounts[topic.key] || 0) !== REQUIRED_PHRASES_PER_TOPIC) {
    throw new Error(
      `Topic "${topic.key}" must have exactly ${REQUIRED_PHRASES_PER_TOPIC} phrases, got ${
        topicCounts[topic.key] || 0
      }`
    );
  }
});

const wordEntries = [
  [1, 'neighbors', 'ha', 'ха', 'да'],
  [1, 'neighbors', 'yo‘q', 'йок', 'нет'],
  [1, 'neighbors', 'men', 'мен', 'я'],
  [1, 'neighbors', 'sen', 'сен', 'ты'],
  [1, 'neighbors', 'siz', 'сиз', 'вы'],
  [1, 'neighbors', 'u', 'у', 'он/она'],
  [1, 'neighbors', 'biz', 'биз', 'мы'],
  [1, 'neighbors', 'ular', 'улар', 'они'],
  [1, 'neighbors', 'bu', 'бу', 'это'],
  [1, 'neighbors', 'ana', 'ана', 'вон тот'],
  [1, 'neighbors', 'qayerda', 'каерда', 'где'],
  [1, 'neighbors', 'qachon', 'качон', 'когда'],
  [1, 'neighbors', 'nega', 'нега', 'почему'],
  [1, 'neighbors', 'kim', 'ким', 'кто'],
  [1, 'neighbors', 'nima', 'нима', 'что'],
  [1, 'neighbors', 'qanday', 'кандай', 'как/какой'],
  [1, 'neighbors', 'bugun', 'бугун', 'сегодня'],
  [1, 'neighbors', 'ertaga', 'ертага', 'завтра'],
  [1, 'neighbors', 'kecha', 'кеча', 'вчера'],
  [1, 'neighbors', 'hozir', 'хозир', 'сейчас'],
  [1, 'neighbors', 'ertalab', 'эрталаб', 'утром'],
  [1, 'neighbors', 'kechqurun', 'кечкирун', 'вечером'],
  [1, 'neighbors', 'kun', 'кун', 'день'],
  [1, 'neighbors', 'hafta', 'хафта', 'неделя'],
  [1, 'neighbors', 'oy', 'ой', 'месяц'],
  [1, 'neighbors', 'yil', 'йил', 'год'],
  [1, 'neighbors', 'bir', 'бир', 'один'],
  [1, 'neighbors', 'ikki', 'икки', 'два'],
  [1, 'neighbors', 'uch', 'уч', 'три'],
  [1, 'neighbors', 'to‘rt', 'торт', 'четыре'],
  [1, 'neighbors', 'besh', 'беш', 'пять'],
  [1, 'neighbors', 'olti', 'олти', 'шесть'],
  [1, 'neighbors', 'yetti', 'етти', 'семь'],
  [1, 'neighbors', 'sakkiz', 'саккиз', 'восемь'],
  [1, 'neighbors', 'to‘qqiz', 'токкиз', 'девять'],
  [1, 'neighbors', 'o‘n', 'он', 'десять'],
  [1, 'neighbors', 'rahmat', 'рахмат', 'спасибо'],
  [1, 'neighbors', 'iltimos', 'илтимос', 'пожалуйста'],
  [1, 'neighbors', 'kechirasiz', 'кечирасиз', 'извините'],
  [1, 'neighbors', 'salom', 'салом', 'привет'],
  [2, 'store', 'non', 'нон', 'хлеб'],
  [2, 'store', 'sut', 'сут', 'молоко'],
  [2, 'store', 'suv', 'сув', 'вода'],
  [2, 'store', 'choy', 'чой', 'чай'],
  [2, 'store', 'qahva', 'кахва', 'кофе'],
  [2, 'store', 'tuz', 'туз', 'соль'],
  [2, 'store', 'shakar', 'шакар', 'сахар'],
  [2, 'store', 'guruch', 'гуруч', 'рис'],
  [2, 'store', 'go‘sht', 'гошт', 'мясо'],
  [2, 'store', 'tovuq', 'товук', 'курица'],
  [2, 'store', 'baliq', 'балик', 'рыба'],
  [2, 'store', 'yog‘', 'йог', 'масло'],
  [2, 'store', 'tuxum', 'тухум', 'яйцо'],
  [2, 'store', 'pishloq', 'пишлок', 'сыр'],
  [2, 'store', 'qatiq', 'катик', 'кефир'],
  [2, 'store', 'do‘kon', 'докон', 'магазин'],
  [2, 'store', 'sotuvchi', 'сотувчи', 'продавец'],
  [2, 'store', 'narx', 'нарх', 'цена'],
  [2, 'store', 'pul', 'пул', 'деньги'],
  [2, 'store', 'naqd', 'накд', 'наличные'],
  [2, 'store', 'karta', 'карта', 'карта'],
  [2, 'store', 'sumka', 'сумка', 'сумка'],
  [2, 'store', 'kiyim', 'кийим', 'одежда'],
  [2, 'store', 'ko‘ylak', 'койлак', 'рубашка'],
  [2, 'store', 'shim', 'шим', 'брюки'],
  [2, 'store', 'oyoq-kiyim', 'оёк-кийим', 'обувь'],
  [2, 'store', 'katta', 'катта', 'большой'],
  [2, 'store', 'kichik', 'кичик', 'маленький'],
  [2, 'store', 'yangi', 'янги', 'новый'],
  [2, 'store', 'eski', 'эски', 'старый'],
  [2, 'store', 'yaxshi', 'яхши', 'хороший'],
  [2, 'store', 'yomon', 'ёмон', 'плохой'],
  [2, 'store', 'qimmat', 'киммат', 'дорогой'],
  [2, 'store', 'arzon', 'арзон', 'дешевый'],
  [2, 'store', 'toza', 'тоза', 'чистый'],
  [2, 'store', 'iflos', 'ифлос', 'грязный'],
  [3, 'bazaar', 'olma', 'олма', 'яблоко'],
  [3, 'bazaar', 'nok', 'нок', 'груша'],
  [3, 'bazaar', 'banan', 'банан', 'банан'],
  [3, 'bazaar', 'uzum', 'узум', 'виноград'],
  [3, 'bazaar', 'shaftoli', 'шафтоли', 'персик'],
  [3, 'bazaar', 'o‘rik', 'урик', 'абрикос'],
  [3, 'bazaar', 'tarvuz', 'тарвуз', 'арбуз'],
  [3, 'bazaar', 'qovun', 'ковун', 'дыня'],
  [3, 'bazaar', 'pomidor', 'помидор', 'помидор'],
  [3, 'bazaar', 'bodring', 'бодринг', 'огурец'],
  [3, 'bazaar', 'piyoz', 'пиёз', 'лук'],
  [3, 'bazaar', 'kartoshka', 'картошка', 'картофель'],
  [3, 'bazaar', 'sabzi', 'сабзи', 'морковь'],
  [3, 'bazaar', 'karam', 'карам', 'капуста'],
  [3, 'bazaar', 'qalampir', 'калампир', 'перец'],
  [3, 'bazaar', 'sarimsoq', 'саримсок', 'чеснок'],
  [3, 'bazaar', 'ko‘kat', 'кокат', 'зелень'],
  [3, 'bazaar', 'meva', 'мева', 'фрукты'],
  [3, 'bazaar', 'sabzavot', 'сабзавот', 'овощи'],
  [3, 'bazaar', 'bozor', 'бозор', 'базар'],
  [3, 'bazaar', 'tarozi', 'тарози', 'весы'],
  [3, 'bazaar', 'kilo', 'кило', 'килограмм'],
  [3, 'bazaar', 'yarim', 'ярим', 'половина'],
  [3, 'bazaar', 'dona', 'дона', 'штука'],
  [3, 'bazaar', 'yaxshiroq', 'яхширок', 'получше'],
  [3, 'bazaar', 'pishgan', 'пишган', 'спелый'],
  [3, 'bazaar', 'xom', 'хом', 'незрелый'],
  [3, 'bazaar', 'shirin', 'ширин', 'сладкий'],
  [3, 'bazaar', 'nordon', 'нордон', 'кислый'],
  [3, 'bazaar', 'achchiq', 'аччик', 'острый'],
  [3, 'bazaar', 'yumshoq', 'юмшок', 'мягкий'],
  [3, 'bazaar', 'qattiq', 'каттик', 'твердый'],
  [4, 'city', 'uy', 'уй', 'дом'],
  [4, 'city', 'ko‘cha', 'коча', 'улица'],
  [4, 'city', 'mahalla', 'махалла', 'квартал/махалля'],
  [4, 'city', 'shahar', 'шахар', 'город'],
  [4, 'city', 'markaz', 'марказ', 'центр'],
  [4, 'city', 'bekat', 'бекат', 'остановка'],
  [4, 'city', 'avtobus', 'автобус', 'автобус'],
  [4, 'city', 'metro', 'метро', 'метро'],
  [4, 'city', 'marshrutka', 'маршрутка', 'маршрутка'],
  [4, 'city', 'taksi', 'такси', 'такси'],
  [4, 'city', 'yo‘l', 'йол', 'дорога'],
  [4, 'city', 'burilish', 'бурилиш', 'поворот'],
  [4, 'city', 'o‘ng', 'онг', 'право'],
  [4, 'city', 'chap', 'чап', 'лево'],
  [4, 'city', 'to‘g‘ri', 'тогри', 'прямо'],
  [4, 'city', 'yaqin', 'якин', 'близко'],
  [4, 'city', 'uzoq', 'узок', 'далеко'],
  [4, 'city', 'tez', 'тез', 'быстро'],
  [4, 'city', 'sekin', 'секин', 'медленно'],
  [4, 'city', 'ish', 'иш', 'работа'],
  [4, 'city', 'bo‘sh', 'бош', 'свободный'],
  [4, 'city', 'vaqt', 'вакт', 'время'],
  [4, 'city', 'soat', 'соат', 'час'],
  [4, 'city', 'daqiqa', 'дакика', 'минута'],
  [4, 'city', 'kirish', 'кириш', 'вход'],
  [4, 'city', 'chiqish', 'чикиш', 'выход'],
  [4, 'city', 'past', 'паст', 'вниз'],
  [4, 'city', 'yuqori', 'юкори', 'вверх'],
  [4, 'city', 'oldin', 'олдин', 'раньше/впереди'],
  [4, 'city', 'keyin', 'кейин', 'позже/после'],
  [4, 'city', 'o‘tish', 'утиш', 'переход'],
  [4, 'city', 'manzil', 'манзил', 'адрес'],
  [5, 'neighbors', 'issiq', 'иссик', 'жарко'],
  [5, 'neighbors', 'sovuq', 'совук', 'холодно'],
  [5, 'neighbors', 'salqin', 'салкин', 'прохладно'],
  [5, 'neighbors', 'shamol', 'шамол', 'ветер'],
  [5, 'neighbors', 'yomg‘ir', 'ёмгир', 'дождь'],
  [5, 'neighbors', 'qor', 'кор', 'снег'],
  [5, 'neighbors', 'quyosh', 'куёш', 'солнце'],
  [5, 'neighbors', 'bulut', 'булут', 'облако'],
  [5, 'neighbors', 'osmon', 'осмон', 'небо'],
  [5, 'neighbors', 'ob-havo', 'об-хаво', 'погода'],
  [5, 'neighbors', 'qo‘shni', 'кошни', 'сосед'],
  [5, 'neighbors', 'do‘st', 'дост', 'друг'],
  [5, 'neighbors', 'tanish', 'таниш', 'знакомый'],
  [5, 'neighbors', 'mehmon', 'мехмон', 'гость'],
  [5, 'neighbors', 'yordam', 'ёрдам', 'помощь'],
  [5, 'neighbors', 'savol', 'савол', 'вопрос'],
  [5, 'neighbors', 'javob', 'жавоб', 'ответ'],
  [5, 'neighbors', 'gap', 'гап', 'разговор/слово'],
  [5, 'neighbors', 'til', 'тил', 'язык'],
  [5, 'neighbors', 'o‘rganish', 'органиш', 'изучение'],
  [5, 'neighbors', 'tushunish', 'тушуниш', 'понимание'],
  [5, 'neighbors', 'eslash', 'эслаш', 'вспоминать'],
  [5, 'neighbors', 'aytish', 'айтиш', 'сказать'],
  [5, 'neighbors', 'eshitish', 'эшитиш', 'слышать'],
  [5, 'neighbors', 'ko‘rish', 'кориш', 'видеть'],
  [5, 'neighbors', 'bilish', 'билиш', 'знать'],
  [5, 'neighbors', 'xohlamoq', 'хохламок', 'хотеть'],
  [5, 'neighbors', 'kerak', 'керак', 'нужно'],
  [5, 'neighbors', 'mumkin', 'мумкин', 'можно'],
  [5, 'neighbors', 'bo‘ladi', 'болади', 'будет/можно'],
  [5, 'neighbors', 'bo‘lmaydi', 'болмайди', 'нельзя/не будет'],
  [6, 'family', 'ota', 'ота', 'отец'],
  [6, 'family', 'ona', 'она', 'мать'],
  [6, 'family', 'aka', 'ака', 'старший брат'],
  [6, 'family', 'uka', 'ука', 'младший брат'],
  [6, 'family', 'opa', 'опа', 'старшая сестра'],
  [6, 'family', 'singil', 'сингил', 'младшая сестра'],
  [6, 'family', 'er', 'эр', 'муж'],
  [6, 'family', 'xotin', 'хотин', 'жена'],
  [6, 'family', 'bola', 'бола', 'ребенок'],
  [6, 'family', 'o‘g‘il', 'огил', 'сын'],
  [6, 'family', 'qiz', 'киз', 'дочь/девушка'],
  [6, 'family', 'nabira', 'набира', 'внук/внучка'],
  [6, 'family', 'oila', 'оила', 'семья'],
  [6, 'family', 'to‘y', 'той', 'свадьба'],
  [6, 'family', 'bayram', 'байрам', 'праздник'],
  [6, 'family', 'tabrik', 'табрик', 'поздравление'],
  [6, 'family', 'tug‘ilgan kun', 'тугилган кун', 'день рождения'],
  [6, 'family', 'sog‘liq', 'соглик', 'здоровье'],
  [6, 'family', 'baxt', 'бахт', 'счастье'],
  [6, 'family', 'tinchlik', 'тинчлик', 'мир/спокойствие'],
  [6, 'family', 'ishlamoq', 'ишламок', 'работать'],
  [6, 'family', 'yashamoq', 'яшамок', 'жить'],
  [6, 'family', 'bor', 'бор', 'есть/имеется'],
  [6, 'family', 'yo‘q', 'йок', 'нет/отсутствует'],
  [6, 'family', 'bermoq', 'бермок', 'давать'],
  [6, 'family', 'olmoq', 'олмок', 'брать'],
  [6, 'family', 'kelmoq', 'келмок', 'приходить'],
  [6, 'family', 'bormoq', 'бормок', 'идти/ехать'],
  [6, 'family', 'o‘tirmoq', 'утирмок', 'сидеть'],
  [6, 'family', 'turmoq', 'турмок', 'стоять/жить'],
  [6, 'family', 'uxlamoq', 'ухламок', 'спать'],
  [6, 'family', 'ovqat', 'овкат', 'еда']
];

const coreWords = wordEntries.map(([level, topicKey, uz, reading, ru]) => ({
  level,
  topicKey,
  uz,
  reading,
  ru
}));

const expansionTemplates = [
  { uz: 'bu {uz}', ru: 'это {ru}', levelBoost: 0 },
  { uz: 'yangi {uz}', ru: 'новый {ru}', levelBoost: 0 },
  { uz: 'katta {uz}', ru: 'большой {ru}', levelBoost: 1 },
  { uz: 'kichik {uz}', ru: 'маленький {ru}', levelBoost: 1 },
  { uz: '{uz} bor', ru: 'есть {ru}', levelBoost: 2 },
  { uz: '{uz} yo‘q', ru: 'нет {ru}', levelBoost: 2 },
  { uz: '{uz} kerak', ru: 'нужен {ru}', levelBoost: 3 },
  { uz: '{uz} qayerda?', ru: 'где {ru}?', levelBoost: 3 },
  { uz: 'menga {uz} kerak', ru: 'мне нужен {ru}', levelBoost: 4 },
  { uz: 'bizga {uz} kerak', ru: 'нам нужен {ru}', levelBoost: 4 },
  { uz: 'shu {uz} yaxshi', ru: 'этот {ru} хороший', levelBoost: 5 },
  { uz: 'shu {uz} yomon', ru: 'этот {ru} плохой', levelBoost: 5 }
];

const expandableWords = coreWords.filter((word) => !word.uz.includes(' '));

function expandWords(words) {
  const result = [];
  words.forEach((word) => {
    expansionTemplates.forEach((template) => {
      const level = Math.min(18, Math.max(7, Number(word.level) + 5 + template.levelBoost));
      result.push({
        level,
        topicKey: word.topicKey,
        uz: template.uz.replace('{uz}', word.uz),
        reading: template.uz.replace('{uz}', word.reading),
        ru: template.ru.replace('{ru}', word.ru)
      });
    });
  });
  return result;
}

const expandedWords = expandWords(expandableWords);

const phraseCoverageWords = [
  { level: 2, topicKey: 'neighbors', uz: 'assalomu', reading: 'ассалому', ru: 'мир вам' },
  { level: 2, topicKey: 'neighbors', uz: 'alaykum', reading: 'алейкум', ru: 'и вам мир' },
  { level: 2, topicKey: 'store', uz: 'bering', reading: 'беринг', ru: 'дайте' },
  { level: 2, topicKey: 'store', uz: 'bormi', reading: 'борми', ru: 'есть ли' },
  { level: 2, topicKey: 'store', uz: 'qancha', reading: 'канча', ru: 'сколько' },
  { level: 2, topicKey: 'store', uz: 'turadi', reading: 'туради', ru: 'стоит' },
  { level: 3, topicKey: 'store', uz: 'arzonroq', reading: 'арзонрок', ru: 'подешевле' },
  { level: 3, topicKey: 'store', uz: 'qabul', reading: 'қабул', ru: 'прием' },
  { level: 3, topicKey: 'store', uz: 'qilasizmi', reading: 'қиласизми', ru: 'вы делаете?' },
  { level: 3, topicKey: 'store', uz: 'iloji', reading: 'иложи', ru: 'возможность' },
  { level: 3, topicKey: 'store', uz: 'bo‘lsa', reading: 'болса', ru: 'если будет' },
  { level: 3, topicKey: 'store', uz: 'yoki', reading: 'ёки', ru: 'или' },
  { level: 3, topicKey: 'store', uz: 'faqat', reading: 'фақат', ru: 'только' },
  { level: 3, topicKey: 'store', uz: 'naqdmi', reading: 'накдми', ru: 'наличными?' },
  { level: 3, topicKey: 'bazaar', uz: 'va', reading: 'ва', ru: 'и' },
  { level: 3, topicKey: 'neighbors', uz: 'shu', reading: 'шу', ru: 'этот/эта' },
  { level: 3, topicKey: 'bazaar', uz: 'yaxshisini', reading: 'яхшисини', ru: 'лучший (вин.)' },
  { level: 3, topicKey: 'bazaar', uz: 'tanlab', reading: 'танлаб', ru: 'выбрав' },
  { level: 3, topicKey: 'bazaar', uz: 'pomidordan', reading: 'помидордан', ru: 'из помидоров' },
  { level: 4, topicKey: 'city', uz: 'markaziga', reading: 'марказига', ru: 'в центр' },
  { level: 4, topicKey: 'city', uz: 'boradimi', reading: 'борадими', ru: 'идет ли/едет ли' },
  { level: 4, topicKey: 'city', uz: 'yerda', reading: 'ерда', ru: 'здесь/в месте' },
  { level: 4, topicKey: 'city', uz: 'tushaman', reading: 'тушаман', ru: 'выхожу' },
  { level: 4, topicKey: 'city', uz: 'bekati', reading: 'бекати', ru: 'остановка (его)' },
  { level: 5, topicKey: 'neighbors', uz: 'havo', reading: 'ҳаво', ru: 'воздух/погода' },
  { level: 5, topicKey: 'neighbors', uz: 'ekan', reading: 'экан', ru: 'оказывается' },
  { level: 5, topicKey: 'neighbors', uz: 'ishlar', reading: 'ишлар', ru: 'дела' },
  { level: 5, topicKey: 'neighbors', uz: 'qalay', reading: 'қалай', ru: 'как' },
  { level: 5, topicKey: 'neighbors', uz: 'uyda', reading: 'уйда', ru: 'дома' },
  { level: 5, topicKey: 'neighbors', uz: 'hamma', reading: 'ҳамма', ru: 'все' },
  { level: 5, topicKey: 'neighbors', uz: 'tinchmi', reading: 'тинчми', ru: 'все спокойно?' },
  { level: 5, topicKey: 'neighbors', uz: 'to‘g‘rimi', reading: 'тўғрими', ru: 'правильно?' },
  { level: 6, topicKey: 'family', uz: 'tabriklayman', reading: 'табриклайман', ru: 'поздравляю' },
  { level: 6, topicKey: 'family', uz: 'o‘g‘ilmi', reading: 'ўғилми', ru: 'мальчик?' },
  { level: 6, topicKey: 'family', uz: 'yo', reading: 'ё', ru: 'или' },
  { level: 6, topicKey: 'family', uz: 'qizmi', reading: 'қизми', ru: 'девочка?' },
  { level: 6, topicKey: 'family', uz: 'baxtli', reading: 'бахтли', ru: 'счастливый' },
  { level: 6, topicKey: 'family', uz: 'bo‘linglar', reading: 'бўлинглар', ru: 'будьте (мн.)' },
  { level: 6, topicKey: 'family', uz: 'farzandingiz', reading: 'фарзандингиз', ru: 'ваш ребенок' },
  { level: 6, topicKey: 'family', uz: 'tug‘ilibdi', reading: 'туғилибди', ru: 'родился/родилась' },
  { level: 6, topicKey: 'family', uz: 'tug‘ilgan', reading: 'туғилган', ru: 'рожденный' },
  { level: 6, topicKey: 'family', uz: 'oilangiz', reading: 'оилангиз', ru: 'ваша семья' },
  { level: 6, topicKey: 'family', uz: 'bilan', reading: 'билан', ru: 'с' }
];

function tokenizeUz(text) {
  return (text.toLowerCase().match(/[a-z\u00c0-\u024f\u0400-\u04ffʻ’'`-]+/gi) || []).map((t) =>
    t.toLowerCase()
  );
}

function buildPhraseTokenWords(cards, knownWords) {
  const known = new Set();
  knownWords.forEach((word) => {
    tokenizeUz(word.uz).forEach((token) => known.add(token));
  });

  const tokenMap = new Map();
  cards.forEach((card) => {
    const text = `${card.uz} ${card.exampleUz}`;
    tokenizeUz(text).forEach((token) => {
      if (!known.has(token) && !tokenMap.has(token)) {
        tokenMap.set(token, {
          level: 7,
          topicKey: card.topicKey,
          uz: token,
          reading: token,
          ru: token
        });
      }
    });
  });

  return Array.from(tokenMap.values());
}

const phraseTokenWords = buildPhraseTokenWords(seedCards, [
  ...coreWords,
  ...expandedWords,
  ...phraseCoverageWords
]);

const uniqueWords = new Map();

[...coreWords, ...expandedWords, ...phraseCoverageWords, ...phraseTokenWords].forEach((word) => {
  const key = word.uz + '::' + word.ru;
  if (!uniqueWords.has(key)) {
    uniqueWords.set(key, word);
  }
});

export const seedWords = Array.from(uniqueWords.values());
