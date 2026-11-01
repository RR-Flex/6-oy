import { KEYS, readText, writeText } from "./storage.js";

const messages = {
  ru: {
    brandSubtitle: "Городской транспортный портал",
    home: "Главная",
    map: "Карта",
    route: "Маршрут",
    fares: "Тарифы",
    reviews: "Отзывы",
    profile: "Профиль",
    more: "Ещё",
    signIn: "Войти",

    appearance: "Оформление",
    chooseBackground: "Выбери фон",
    themeLight: "Светлый",
    themeMint: "Мятный",
    themeSunset: "Закат",
    themeLavender: "Лаванда",
    themeOcean: "Океан",
    themeDark: "Тёмный",
    customBackground: "Свой цвет фона",
    resetTheme: "Сбросить оформление",
    notifications: "Уведомления",
    markRead: "Прочитано",

    heroEyebrow: "УМНЫЙ ТРАНСПОРТ ТАШКЕНТА",
    heroTitle: "Город ближе,<br><span>когда маршрут понятен.</span>",
    heroDescription:
      "Планируй поездки, изучай станции и управляй транспортными картами в одном месте.",
    planTrip: "Построить маршрут",
    exploreMap: "Изучить карту",
    smartSearch: "Удобный поиск",
    routePlanner: "Планировщик маршрутов",
    personalArea: "Личный кабинет",
    metroLines: "линии метро",
    startJourney: "Начни поездку здесь",
    timeTashkent: "СЕЙЧАС В ТАШКЕНТЕ",
    planAhead: "Планируй поездку заранее",
    checkRoute: "Проверь станции и пересадки перед выходом.",
    openPlanner: "К планировщику",
    featuresEyebrow: "ВОЗМОЖНОСТИ",
    everythingHere: "Всё нужное — в одном месте",
    smartRoute: "Умный маршрут",
    smartRouteText: "Найди путь между станциями и посмотри пересадки.",
    calculateRoute: "Рассчитать путь",
    transportCards: "Транспортные карты",
    cardsText: "Добавляй ATTO и банковские карты в демо-профиль.",
    myCards: "Мои карты",
    reviewsText: "Оцени сайт и предложи новые функции.",
    leaveReview: "Оставить отзыв",
    demoNoticeTitle: "Независимый демо-проект",
    demoNoticeText:
      "Неофициальный сайт. Карта использует OpenStreetMap. Реальные прибытия поездов появятся только при наличии официального источника данных.",

    networkMap: "СХЕМА СЕТИ",
    metroMap: "Карта метро",
    mapDescription: "Изучай Ташкент на интерактивной карте.",
    interactive: "ИНТЕРАКТИВНАЯ",
    cityMap: "ГОРОДСКАЯ КАРТА",
    tashkentMap: "Карта Ташкента",
    mapHint: "Перемещай карту и приближай нужные районы.",
    centerCity: "На центр города",
    metroStations: "Станции метро из OpenStreetMap",
    selectedStation: "Выбранная станция",
    mapCopyright:
      "Карта: © OpenStreetMap contributors. Сведения о станциях зависят от данных OSM.",
    stationDirectory: "СПРАВОЧНИК",
    stations: "Станции",
    searchStation: "Найти станцию…",
    stationDisclaimer:
      "Список линий в этой демо-сборке является ориентировочной схемой и должен быть сверён с актуальной официальной картой.",
    allLines: "Все линии",

    planner: "ПЛАНИРОВЩИК",
    buildRoute: "Построить маршрут",
    routeDescription: "Найди путь между станциями и посмотри его на карте.",
    from: "Откуда",
    to: "Куда",
    chooseStation: "Выбери станцию",
    findRoute: "Найти маршрут",
    routeTipTitle: "Полезный совет",
    routeTipText:
      "Маршрут рассчитывается по упрощённой схеме связей станций. Время поездки и ожидания не прогнозируется.",
    viewStations: "Посмотреть станции",
    routeOnMap: "Маршрут на карте",
    chooseRouteFirst: "Сначала построй маршрут",
    trainArrivals: "Прибытие поездов",
    noRealtimeSource: "Реальный источник прибытия не подключён.",
    refresh: "Обновить",
    selectStationBoard: "Выбери станцию для просмотра табло.",
    arrivalDisclaimer:
      "Время прибытия показывается только при наличии проверенного источника. Демонстрационные минуты не используются.",

    payment: "ОПЛАТА ПРОЕЗДА",
    faresTitle: "Тарифы и карты",
    faresDescription: "Справочная информация о способах оплаты.",
    transportCard: "ТРАНСПОРТНАЯ КАРТА",
    bankCard: "БАНКОВСКАЯ КАРТА",
    attoFareText:
      "Электронная разовая поездка по опубликованному тарифу от октября 2026 года.",
    bankFareText: "Оплата при поддержке карты и терминала.",
    officialSources: "Официальные источники",
    fareDisclaimer:
      "*Уточняй условия оплаты у оператора и банка. Тарифы могут изменяться.",

    reviewsTitle: "Отзывы пассажиров",
    reviewsDescription: "Поделись мнением о сайте, карте и маршрутах.",
    yourName: "Твоё имя",
    rating: "Оценка",
    chooseRating: "Выбери оценку",
    reviewMessage: "Текст отзыва",
    sendReview: "Отправить отзыв",
    localReviewNotice:
      "Отзывы сохраняются в этом браузере и не видны другим посетителям.",
    allReviews: "Отзывы",
    all: "Все",
    noReviews: "Пока нет отзывов. Будь первым!",
    reviewSaved: "Спасибо за отзыв!",
    reviewInvalid: "Проверь имя, оценку и текст отзыва.",

    personalAccount: "ЛИЧНЫЙ КАБИНЕТ",
    profileWelcome: "Твой транспорт — под контролем",
    profileIntro:
      "Войди в демо-аккаунт, чтобы сохранять карты и смотреть пример истории поездок.",
    signInRegister: "Войти / Регистрация",
    hello: "Привет",
    profileSubheading: "Твои транспортные карты и поездки.",
    signOut: "Выйти",
    addCard: "＋ Добавить карту",
    emptyCards: "Пока нет карт. Добавь демонстрационную запись.",
    accountSummary: "Сводка аккаунта",
    cardsCount: "Карт",
    tripsCount: "Поездок",
    cardBalance: "Баланс карт",
    noData: "Нет данных",
    balanceNote: "Нужна интеграция с оператором/банком",
    balanceDisclaimer: "Реальный баланс не запрашивается и не отображается.",
    tripHistory: "История поездок",
    sampleTrips: "Демонстрационные записи, не реальные транзакции.",
    allTrips: "Все поездки",
    metroOnly: "Метро",
    busOnly: "Автобус",

    moreFeatures: "Дополнительные возможности",
    moreDescription: "Изучай функции проекта и полезную информацию.",
    featuresTab: "Возможности",
    faqTab: "Частые вопросы",
    aboutTab: "О проекте",
    interactiveMapFeature: "Интерактивная карта",
    interactiveMapText:
      "Перемещение, масштабирование и просмотр доступных станций.",
    openMap: "Открыть карту",
    passengerReviews: "Отзывы пассажиров",
    passengerReviewsText: "Оставляй оценки и предложения.",
    writeReview: "Написать отзыв",
    routePlannerFeature: "Планировщик маршрутов",
    routePlannerText: "Ищи путь между станциями.",
    modalExample: "Пример модального окна",
    modalExampleText: "Открой дополнительное окно.",
    openModal: "Открыть окно",
    faq1q: "Как построить маршрут?",
    faq1a: "Открой маршрут, выбери станции и нажми «Найти маршрут».",
    faq2q: "Почему не показывается прибытие поездов?",
    faq2a:
      "Нужен официальный live-источник. Сайт не показывает выдуманные минуты.",
    faq3q: "Работает ли сайт на телефоне?",
    faq3a: "Да, интерфейс адаптируется под мобильные устройства.",
    faq4q: "Можно ли изменить фон?",
    faq4a:
      "Да, нажми значок оформления в шапке и выбери одну из тем или собственный цвет.",
    aboutText:
      "Независимый демонстрационный проект о городском транспорте Ташкента. Не является официальным сайтом метрополитена или ATTO.",
    footerDisclaimer:
      "Независимый демонстрационный проект. Неофициальный сервис.",

    demoLogin: "Демо-вход",
    phoneNumber: "Номер телефона",
    continue: "Продолжить",
    demoAuthNote:
      "Это локальный демонстрационный профиль. Настоящая авторизация требует защищённого сервера.",
    addTransportCard: "Добавить транспортную карту",
    cardType: "Тип карты",
    cardNumber: "Номер карты (демо)",
    cardSecurity:
      "Не вводи PIN, CVV/CVC или срок действия. Сайт сохранит только последние четыре цифры номера.",
    helloThere: "Привет! 👋",
    modalDescription:
      "Это пример модального окна. Позже здесь можно показывать подробности станций и настройки.",
    close: "Закрыть",

    routeFound: "МАРШРУТ ПОСТРОЕН",
    segments: "перегонов",
    transfers: "Пересадок",
    startStation: "Начальная станция",
    destinationStation: "Пункт назначения",
    transferStation: "Пересадочная станция",
    nextStation: "Следующая станция",
    sameStation: "Выбери две разные станции.",
    routeNotFound: "Путь в демо-схеме не найден.",
    copied: "Маршрут скопирован.",
    copyRoute: "Скопировать маршрут",
    routeSaved: "Последний маршрут сохранён.",
    stationInfo: "Линия",
    favorite: "В избранное",
    removeFavorite: "Убрать из избранного",
    addedFavorite: "Добавлено в избранное",
    removedFavorite: "Убрано из избранного",

    lineChilanzar: "Чиланзарская",
    lineUzbekistan: "Узбекистанская",
    lineYunusabad: "Юнусабадская",
    lineOverground: "Линия 30-летия независимости",

    noLiveData: "Реальный источник прибытия не подключён.",
    selectStation: "Выбери станцию",
    liveSourceMissing:
      "Оператор не предоставил публичный поток прибытия поездов для этого демо-проекта. Прогнозы не выдумываются.",
    loading: "Загрузка…",
    staleData: "Данные устарели, запроси обновление.",
    noArrivals: "Сейчас нет прогнозов для этой станции.",

    cardDuplicate: "Такая демо-карта уже добавлена.",
    cardAdded: "Карта добавлена в демо-профиль.",
    cardRemoved: "Карта удалена.",
    cardInvalid: "Проверь номер карты.",
    authNameRequired: "Введи имя и номер телефона.",
    profileLoggedOut: "Ты вышел из демо-профиля.",
    welcomeBack: "Профиль открыт.",

    noStationsFound: "Станции не найдены.",
    osmStationSource: "Названия и координаты загружены из OpenStreetMap.",
    osmUnavailable:
      "Не удалось загрузить данные станций OpenStreetMap. Сама карта остаётся доступной.",
    mapCoordinatesMissing:
      "Не удалось сопоставить все станции с координатами карты.",
    themeUpdated: "Оформление изменено.",
    themeReset: "Оформление сброшено.",
  },

  en: {
    brandSubtitle: "City transport portal",
    home: "Home",
    map: "Map",
    route: "Route",
    fares: "Fares",
    reviews: "Reviews",
    profile: "Profile",
    more: "More",
    signIn: "Sign in",

    appearance: "Appearance",
    chooseBackground: "Choose a background",
    themeLight: "Light",
    themeMint: "Mint",
    themeSunset: "Sunset",
    themeLavender: "Lavender",
    themeOcean: "Ocean",
    themeDark: "Dark",
    customBackground: "Custom background",
    resetTheme: "Reset appearance",
    notifications: "Notifications",
    markRead: "Mark as read",

    heroEyebrow: "SMART TRANSPORT OF TASHKENT",
    heroTitle:
      "The city feels closer,<br><span>when your route is clear.</span>",
    heroDescription:
      "Plan trips, explore stations and manage transport cards in one place.",
    planTrip: "Plan a route",
    exploreMap: "Explore map",
    smartSearch: "Easy search",
    routePlanner: "Route planner",
    personalArea: "Personal account",
    metroLines: "metro lines",
    startJourney: "Start your journey here",
    timeTashkent: "TIME IN TASHKENT",
    planAhead: "Plan your trip ahead",
    checkRoute: "Check stations and transfers before leaving.",
    openPlanner: "Open planner",
    featuresEyebrow: "FEATURES",
    everythingHere: "Everything you need in one place",
    smartRoute: "Smart route",
    smartRouteText: "Find a path between stations and see transfers.",
    calculateRoute: "Calculate route",
    transportCards: "Transport cards",
    cardsText: "Add ATTO and bank cards to your demo profile.",
    myCards: "My cards",
    reviewsText: "Rate the website and suggest new features.",
    leaveReview: "Leave a review",
    demoNoticeTitle: "Independent demo project",
    demoNoticeText:
      "Unofficial website. The map uses OpenStreetMap. Live arrivals require an official data source.",

    networkMap: "NETWORK MAP",
    metroMap: "Metro map",
    mapDescription: "Explore Tashkent on an interactive map.",
    interactive: "INTERACTIVE",
    cityMap: "CITY MAP",
    tashkentMap: "Map of Tashkent",
    mapHint: "Drag the map and zoom into districts.",
    centerCity: "City centre",
    metroStations: "Metro stations from OpenStreetMap",
    selectedStation: "Selected station",
    mapCopyright:
      "Map: © OpenStreetMap contributors. Station details depend on OSM data.",
    stationDirectory: "DIRECTORY",
    stations: "Stations",
    searchStation: "Search for a station…",
    stationDisclaimer:
      "The line list in this demo is an indicative schematic and should be checked against the current official map.",
    allLines: "All lines",

    planner: "PLANNER",
    buildRoute: "Plan a route",
    routeDescription: "Find a path between stations and view it on the map.",
    from: "From",
    to: "To",
    chooseStation: "Choose a station",
    findRoute: "Find route",
    routeTipTitle: "Helpful tip",
    routeTipText:
      "The route uses a simplified station graph. Journey and waiting times are not predicted.",
    viewStations: "View stations",
    routeOnMap: "Route on map",
    chooseRouteFirst: "Build a route first",
    trainArrivals: "Train arrivals",
    noRealtimeSource: "No live arrival source is connected.",
    refresh: "Refresh",
    selectStationBoard: "Choose a station to view the board.",
    arrivalDisclaimer:
      "Arrival times are displayed only with a verified source. No demo minutes are invented.",

    payment: "FARE PAYMENT",
    faresTitle: "Fares and cards",
    faresDescription: "Reference information about payment methods.",
    transportCard: "TRANSPORT CARD",
    bankCard: "BANK CARD",
    attoFareText: "Electronic single-ride fare published for October 2026.",
    bankFareText: "Payment depends on card and terminal support.",
    officialSources: "Official sources",
    fareDisclaimer:
      "*Check payment conditions with the operator and your bank. Fares may change.",

    reviewsTitle: "Passenger reviews",
    reviewsDescription:
      "Share your thoughts about the website, map and routes.",
    yourName: "Your name",
    rating: "Rating",
    chooseRating: "Choose a rating",
    reviewMessage: "Review text",
    sendReview: "Submit review",
    localReviewNotice:
      "Reviews are stored in this browser and are not visible to other visitors.",
    allReviews: "Reviews",
    all: "All",
    noReviews: "No reviews yet. Be the first!",
    reviewSaved: "Thank you for your review!",
    reviewInvalid: "Check your name, rating and review text.",

    personalAccount: "PERSONAL ACCOUNT",
    profileWelcome: "Your transport, under control",
    profileIntro:
      "Sign in to a demo profile to save cards and view sample trip history.",
    signInRegister: "Sign in / Register",
    hello: "Hello",
    profileSubheading: "Your transport cards and trips.",
    signOut: "Sign out",
    addCard: "＋ Add card",
    emptyCards: "No cards yet. Add a demo card.",
    accountSummary: "Account summary",
    cardsCount: "Cards",
    tripsCount: "Trips",
    cardBalance: "Card balance",
    noData: "No data",
    balanceNote: "Operator/bank integration required",
    balanceDisclaimer: "Real balances are not requested or displayed.",
    tripHistory: "Trip history",
    sampleTrips: "Sample records, not real transactions.",
    allTrips: "All trips",
    metroOnly: "Metro",
    busOnly: "Bus",

    moreFeatures: "More features",
    moreDescription: "Explore project features and useful information.",
    featuresTab: "Features",
    faqTab: "FAQ",
    aboutTab: "About",
    interactiveMapFeature: "Interactive map",
    interactiveMapText: "Pan, zoom and view available stations.",
    openMap: "Open map",
    passengerReviews: "Passenger reviews",
    passengerReviewsText: "Leave ratings and suggestions.",
    writeReview: "Write a review",
    routePlannerFeature: "Route planner",
    routePlannerText: "Find a path between stations.",
    modalExample: "Modal window example",
    modalExampleText: "Open an extra window.",
    openModal: "Open modal",
    faq1q: "How do I plan a route?",
    faq1a: "Open the route page, choose stations and click Find route.",
    faq2q: "Why are train arrivals unavailable?",
    faq2a:
      "An official live data source is required. The site does not invent minutes.",
    faq3q: "Does the website work on phones?",
    faq3a: "Yes, the interface adapts to mobile devices.",
    faq4q: "Can I change the background?",
    faq4a:
      "Yes, open the appearance menu in the header and choose a theme or a custom color.",
    aboutText:
      "An independent demo project about Tashkent public transport. Not an official metro or ATTO website.",
    footerDisclaimer: "Independent demo project. Unofficial service.",

    demoLogin: "Demo sign in",
    phoneNumber: "Phone number",
    continue: "Continue",
    demoAuthNote:
      "This is a local demo profile. Real authentication requires a secure server.",
    addTransportCard: "Add transport card",
    cardType: "Card type",
    cardNumber: "Card number (demo)",
    cardSecurity:
      "Do not enter PIN, CVV/CVC or expiry date. Only the last four digits are stored.",
    helloThere: "Hello! 👋",
    modalDescription:
      "This is an example modal. Station details and settings can be shown here later.",
    close: "Close",

    routeFound: "ROUTE FOUND",
    segments: "segments",
    transfers: "Transfers",
    startStation: "Starting station",
    destinationStation: "Destination",
    transferStation: "Transfer station",
    nextStation: "Next station",
    sameStation: "Choose two different stations.",
    routeNotFound: "No path found in the demo graph.",
    copied: "Route copied.",
    copyRoute: "Copy route",
    routeSaved: "Last route saved.",
    stationInfo: "Line",
    favorite: "Add to favourites",
    removeFavorite: "Remove from favourites",
    addedFavorite: "Added to favourites",
    removedFavorite: "Removed from favourites",

    lineChilanzar: "Chilonzor Line",
    lineUzbekistan: "Uzbekistan Line",
    lineYunusabad: "Yunusabad Line",
    lineOverground: "30th Anniversary Line",

    noLiveData: "No live arrival source is connected.",
    selectStation: "Choose a station",
    liveSourceMissing:
      "The operator has not provided a public train-arrival feed for this demo. Predictions are not invented.",
    loading: "Loading…",
    staleData: "Data is stale. Refresh the board.",
    noArrivals: "No arrival predictions are available for this station.",

    cardDuplicate: "This demo card has already been added.",
    cardAdded: "Card added to your demo profile.",
    cardRemoved: "Card removed.",
    cardInvalid: "Check the card number.",
    authNameRequired: "Enter your name and phone number.",
    profileLoggedOut: "You have signed out of the demo profile.",
    welcomeBack: "Profile opened.",

    noStationsFound: "No stations found.",
    osmStationSource:
      "Station names and coordinates loaded from OpenStreetMap.",
    osmUnavailable:
      "Could not load OpenStreetMap station data. The base map is still available.",
    mapCoordinatesMissing:
      "Some stations could not be matched to map coordinates.",
    themeUpdated: "Appearance updated.",
    themeReset: "Appearance reset.",
  },

  uz: {
    brandSubtitle: "Shahar transport portali",
    home: "Bosh sahifa",
    map: "Xarita",
    route: "Yo‘nalish",
    fares: "Tariflar",
    reviews: "Fikrlar",
    profile: "Profil",
    more: "Yana",
    signIn: "Kirish",

    appearance: "Dizayn",
    chooseBackground: "Fon rangini tanlang",
    themeLight: "Yorug‘",
    themeMint: "Yalpiz",
    themeSunset: "Quyosh botishi",
    themeLavender: "Lavanda",
    themeOcean: "Okean",
    themeDark: "Qorong‘i",
    customBackground: "O‘z fon rangingiz",
    resetTheme: "Dizaynni tiklash",
    notifications: "Bildirishnomalar",
    markRead: "O‘qilgan deb belgilash",

    heroEyebrow: "TOSHKENTNING AQILLI TRANSPORTI",
    heroTitle: "Shahar yaqinroq,<br><span>yo‘nalish aniq bo‘lsa.</span>",
    heroDescription:
      "Safarlarni rejalashtir, bekatlarni o‘rgan va transport kartalarini bir joyda boshqar.",
    planTrip: "Yo‘nalish tuzish",
    exploreMap: "Xaritani ko‘rish",
    smartSearch: "Qulay qidiruv",
    routePlanner: "Yo‘nalish rejalashtirgichi",
    personalArea: "Shaxsiy kabinet",
    metroLines: "metro liniyasi",
    startJourney: "Safarni shu yerdan boshlang",
    timeTashkent: "TOSHKENT VAQTI",
    planAhead: "Safarni oldindan rejalashtiring",
    checkRoute: "Yo‘lga chiqishdan oldin bekat va almashuvlarni tekshiring.",
    openPlanner: "Rejalashtirgich",
    featuresEyebrow: "IMKONIYATLAR",
    everythingHere: "Kerakli hamma narsa bir joyda",
    smartRoute: "Aqlli yo‘nalish",
    smartRouteText: "Bekatlar orasidagi yo‘lni va almashuvlarni toping.",
    calculateRoute: "Yo‘lni hisoblash",
    transportCards: "Transport kartalari",
    cardsText: "ATTO va bank kartalarini demo profilingizga qo‘shing.",
    myCards: "Kartalarim",
    reviewsText: "Saytni baholang va yangi imkoniyatlarni taklif qiling.",
    leaveReview: "Fikr qoldirish",
    demoNoticeTitle: "Mustaqil demo loyiha",
    demoNoticeText:
      "Norasmiy sayt. Xarita OpenStreetMap’dan foydalanadi. Poyezdlarning real kelish vaqti faqat rasmiy ma’lumot manbasi bo‘lsa ko‘rsatiladi.",

    networkMap: "TARMOQ XARITASI",
    metroMap: "Metro xaritasi",
    mapDescription: "Toshkentni interaktiv xaritada o‘rganing.",
    interactive: "INTERAKTIV",
    cityMap: "SHAHAR XARITASI",
    tashkentMap: "Toshkent xaritasi",
    mapHint: "Xaritani suring va kerakli hududni kattalashtiring.",
    centerCity: "Shahar markazi",
    metroStations: "OpenStreetMap’dagi metro bekatlari",
    selectedStation: "Tanlangan bekat",
    mapCopyright:
      "Xarita: © OpenStreetMap contributors. Bekatlar haqidagi ma’lumotlar OSM’ga bog‘liq.",
    stationDirectory: "MA’LUMOTNOMA",
    stations: "Bekatlar",
    searchStation: "Bekatni qidirish…",
    stationDisclaimer:
      "Demo versiyadagi liniyalar ro‘yxati taxminiy sxema bo‘lib, amaldagi rasmiy xarita bilan tekshirilishi kerak.",
    allLines: "Barcha liniyalar",

    planner: "REJALASHTIRGICH",
    buildRoute: "Yo‘nalish tuzish",
    routeDescription: "Bekatlar orasidagi yo‘lni toping va xaritada ko‘ring.",
    from: "Qayerdan",
    to: "Qayerga",
    chooseStation: "Bekatni tanlang",
    findRoute: "Yo‘nalishni topish",
    routeTipTitle: "Foydali maslahat",
    routeTipText:
      "Yo‘nalish bekatlarning soddalashtirilgan bog‘lanish sxemasi asosida hisoblanadi. Safar va kutish vaqti prognoz qilinmaydi.",
    viewStations: "Bekatlarni ko‘rish",
    routeOnMap: "Xaritadagi yo‘nalish",
    chooseRouteFirst: "Avval yo‘nalish tuzing",
    trainArrivals: "Poyezd kelishi",
    noRealtimeSource: "Haqiqiy kelish manbasi ulanmagan.",
    refresh: "Yangilash",
    selectStationBoard: "Jadvalni ko‘rish uchun bekatni tanlang.",
    arrivalDisclaimer:
      "Kelish vaqti faqat tasdiqlangan manba mavjud bo‘lsa ko‘rsatiladi. Soxta daqiqalar ishlatilmaydi.",

    payment: "YO‘L HAQI",
    faresTitle: "Tariflar va kartalar",
    faresDescription: "To‘lov usullari haqida ma’lumot.",
    transportCard: "TRANSPORT KARTASI",
    bankCard: "BANK KARTASI",
    attoFareText:
      "2026-yil oktabr oyida e’lon qilingan elektron bir martalik tarif.",
    bankFareText: "To‘lov karta va terminal qo‘llab-quvvatlashiga bog‘liq.",
    officialSources: "Rasmiy manbalar",
    fareDisclaimer:
      "*To‘lov shartlarini operator va bankingizdan tekshiring. Tariflar o‘zgarishi mumkin.",

    reviewsTitle: "Yo‘lovchilar fikrlari",
    reviewsDescription:
      "Sayt, xarita va yo‘nalishlar haqidagi fikringizni yozing.",
    yourName: "Ismingiz",
    rating: "Baho",
    chooseRating: "Bahoni tanlang",
    reviewMessage: "Fikr matni",
    sendReview: "Fikrni yuborish",
    localReviewNotice:
      "Fikrlar shu brauzerda saqlanadi va boshqa foydalanuvchilarga ko‘rinmaydi.",
    allReviews: "Fikrlar",
    all: "Barchasi",
    noReviews: "Hozircha fikrlar yo‘q. Birinchi bo‘ling!",
    reviewSaved: "Fikringiz uchun rahmat!",
    reviewInvalid: "Ism, baho va fikr matnini tekshiring.",

    personalAccount: "SHAXSIY KABINET",
    profileWelcome: "Transportingiz nazorat ostida",
    profileIntro:
      "Kartalarni saqlash va safarlar tarixini ko‘rish uchun demo profilga kiring.",
    signInRegister: "Kirish / Ro‘yxatdan o‘tish",
    hello: "Salom",
    profileSubheading: "Transport kartalaringiz va safarlaringiz.",
    signOut: "Chiqish",
    addCard: "＋ Karta qo‘shish",
    emptyCards: "Hozircha karta yo‘q. Demo kartani qo‘shing.",
    accountSummary: "Profil xulosasi",
    cardsCount: "Kartalar",
    tripsCount: "Safarlar",
    cardBalance: "Kartalar balansi",
    noData: "Ma’lumot yo‘q",
    balanceNote: "Operator/bank integratsiyasi kerak",
    balanceDisclaimer: "Haqiqiy balans so‘ralmaydi va ko‘rsatilmaydi.",
    tripHistory: "Safarlar tarixi",
    sampleTrips: "Namuna yozuvlar, haqiqiy tranzaksiyalar emas.",
    allTrips: "Barcha safarlar",
    metroOnly: "Metro",
    busOnly: "Avtobus",

    moreFeatures: "Qo‘shimcha imkoniyatlar",
    moreDescription: "Loyiha funksiyalari va foydali ma’lumotlarni o‘rganing.",
    featuresTab: "Imkoniyatlar",
    faqTab: "Savol-javob",
    aboutTab: "Loyiha haqida",
    interactiveMapFeature: "Interaktiv xarita",
    interactiveMapText:
      "Xaritani surish, kattalashtirish va bekatlarni ko‘rish.",
    openMap: "Xaritani ochish",
    passengerReviews: "Yo‘lovchilar fikrlari",
    passengerReviewsText: "Baho va takliflar qoldiring.",
    writeReview: "Fikr yozish",
    routePlannerFeature: "Yo‘nalish rejalashtirgichi",
    routePlannerText: "Bekatlar orasidagi yo‘lni toping.",
    modalExample: "Modal oyna namunasi",
    modalExampleText: "Qo‘shimcha oynani oching.",
    openModal: "Oynani ochish",
    faq1q: "Yo‘nalishni qanday tuzaman?",
    faq1a: "Yo‘nalish sahifasini oching, bekatlarni tanlang va tugmani bosing.",
    faq2q: "Nega poyezd kelish vaqti ko‘rsatilmaydi?",
    faq2a: "Rasmiy real vaqt ma’lumotlari kerak. Sayt soxta vaqt ko‘rsatmaydi.",
    faq3q: "Sayt telefonda ishlaydimi?",
    faq3a: "Ha, interfeys mobil qurilmalarga moslashadi.",
    faq4q: "Fon rangini o‘zgartirish mumkinmi?",
    faq4a:
      "Ha, yuqoridagi dizayn belgisini bosing va mavzu yoki rangni tanlang.",
    aboutText:
      "Toshkent jamoat transporti haqidagi mustaqil demo loyiha. Metro yoki ATTO’ning rasmiy sayti emas.",
    footerDisclaimer: "Mustaqil demo loyiha. Norasmiy xizmat.",

    demoLogin: "Demo kirish",
    phoneNumber: "Telefon raqami",
    continue: "Davom etish",
    demoAuthNote:
      "Bu mahalliy demo profil. Haqiqiy autentifikatsiya uchun himoyalangan server kerak.",
    addTransportCard: "Transport kartasini qo‘shish",
    cardType: "Karta turi",
    cardNumber: "Karta raqami (demo)",
    cardSecurity:
      "PIN, CVV/CVC yoki amal qilish muddatini kiritmang. Faqat oxirgi to‘rt raqam saqlanadi.",
    helloThere: "Salom! 👋",
    modalDescription:
      "Bu modal oyna namunasi. Keyinchalik bu yerda bekat tafsilotlari va sozlamalar ko‘rsatilishi mumkin.",
    close: "Yopish",

    routeFound: "YO‘NALISH TOPILDI",
    segments: "oraliq",
    transfers: "Almashuvlar",
    startStation: "Boshlang‘ich bekat",
    destinationStation: "Borish bekati",
    transferStation: "Almashuv bekati",
    nextStation: "Keyingi bekat",
    sameStation: "Ikkita boshqa bekatni tanlang.",
    routeNotFound: "Demo sxemada yo‘l topilmadi.",
    copied: "Yo‘nalish nusxalandi.",
    copyRoute: "Yo‘nalishni nusxalash",
    routeSaved: "Oxirgi yo‘nalish saqlandi.",
    stationInfo: "Liniya",
    favorite: "Sevimlilarga qo‘shish",
    removeFavorite: "Sevimlilardan olib tashlash",
    addedFavorite: "Sevimlilarga qo‘shildi",
    removedFavorite: "Sevimlilardan olib tashlandi",

    lineChilanzar: "Chilonzor yo‘li",
    lineUzbekistan: "O‘zbekiston yo‘li",
    lineYunusabad: "Yunusobod yo‘li",
    lineOverground: "Mustaqillikning 30 yilligi yo‘li",

    noLiveData: "Haqiqiy kelish manbasi ulanmagan.",
    selectStation: "Bekatni tanlang",
    liveSourceMissing:
      "Operator ushbu demo loyiha uchun ochiq poyezd kelish ma’lumotlarini taqdim etmagan. Prognozlar to‘qib chiqarilmaydi.",
    loading: "Yuklanmoqda…",
    staleData: "Ma’lumot eskirgan. Jadvalni yangilang.",
    noArrivals: "Ushbu bekat uchun prognoz mavjud emas.",

    cardDuplicate: "Bu demo karta allaqachon qo‘shilgan.",
    cardAdded: "Karta demo profilga qo‘shildi.",
    cardRemoved: "Karta olib tashlandi.",
    cardInvalid: "Karta raqamini tekshiring.",
    authNameRequired: "Ism va telefon raqamini kiriting.",
    profileLoggedOut: "Demo profildan chiqdingiz.",
    welcomeBack: "Profil ochildi.",

    noStationsFound: "Bekatlar topilmadi.",
    osmStationSource:
      "Bekat nomlari va koordinatalari OpenStreetMap’dan yuklandi.",
    osmUnavailable:
      "OpenStreetMap bekat ma’lumotlarini yuklab bo‘lmadi. Asosiy xarita ishlashda davom etadi.",
    mapCoordinatesMissing:
      "Ba’zi bekatlarni xarita koordinatalari bilan moslab bo‘lmadi.",
    themeUpdated: "Dizayn o‘zgartirildi.",
    themeReset: "Dizayn tiklandi.",
  },
};

let currentLanguage = "ru";

export function t(key) {
  return messages[currentLanguage]?.[key] ?? messages.ru[key] ?? key;
}

export function getLanguage() {
  return currentLanguage;
}

export function lineName(id) {
  const keys = {
    chilanzar: "lineChilanzar",
    uzbekistan: "lineUzbekistan",
    yunusabad: "lineYunusabad",
    overground: "lineOverground",
  };

  return t(keys[id] || id);
}

export function setLanguage(language) {
  if (!messages[language]) return;

  currentLanguage = language;

  writeText(KEYS.language, language);

  document.documentElement.lang = language;

  applyTranslations();

  document.dispatchEvent(
    new CustomEvent("languagechange", {
      detail: { language },
    }),
  );
}

export function applyTranslations() {
  document.documentElement.lang = currentLanguage;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;

    const translated = t(key);

    if (element.dataset.i18nHtml === "true") {
      element.innerHTML = translated;
    } else {
      element.textContent = translated;
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  const select = document.getElementById("languageSelect");

  if (select) {
    select.value = currentLanguage;
  }
}

export function initI18n() {
  const saved = readText(KEYS.language, "ru");

  currentLanguage = messages[saved] ? saved : "ru";

  document
    .getElementById("languageSelect")
    ?.addEventListener("change", (event) => {
      setLanguage(event.target.value);
    });

  applyTranslations();
}
