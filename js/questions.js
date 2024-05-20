
let idT = 1;
//событие сработает после загрузки всей страницы
window.onload = () => {
    //параметры переданные в url запросе
    let val = get_param('idT');
    //id темы
    idT = parseInt(val, 0);
    //инициализация игрового бара
    initBarUser();
    //очистка отрисованных элементов вопроса
    clearQuestion();
    //получение json объекта из локального хранилища
    let jsonObjectThemes = get_data_themes();
    //получение следующего вопроса
    let objectQuestion = get_data_notQ_next(jsonObjectThemes, idT);
    if (objectQuestion != undefined){
        //отрисовка вопроса
        viewQuestion(objectQuestion);
        //вызов альтруиста если он небыл вызван ранее
        altruist('question');
    } else {
        //нет вопросов. возврат на страницу тем
        location.href = 'themes.html';
    }  
}

//отрисовка поинтов на странице
function setPoints(points){
    document.querySelector('#points').innerText = 'Очки: ' + points;
}

//отрисовка пользовательского бара
function initBarUser() {
    //получение json объекта игрока
    const jsonObjectUser = get_data_user();
    //отрисовка поинтов
    setPoints(jsonObjectUser.points);
    //очистка элементов жизней
    clearItemsHelth();
    //отрисовка жизней
    setHeltBar(jsonObjectUser.lives);
    //отриовка щита
    showShild(jsonObjectUser.shild);
}

//очистка отрисованных элементов вопроса
function clearQuestion() {
    let bQ = document.querySelector('.block-question');
    if (bQ != null) {
        let bP = bQ.children[0];
        let bAS = bQ.children[1];
    
        while(bAS.children > 0) {
            let bA = bAS[0];
            //удаление обработчика нажатия по вопросу
            bA.removeEventListener('mouseup', click_answer);
            bA.remove();
        }
    
        bAS.remove();
        bP.remove();
        bQ.remove();
    }
}

//классы стилей для элементов вопроса
const classesBlockQ = ['block-question', 'mt-3'];
const classesBlockQ_elementP = ['text-center', 'fs-4'];
const classesBlockQ_elementAS = ['block-answers', 'd-flex', 'flex-column'];
const classesBlockQ_elementA = ['answer', 'text-center', 'fw-bold', 'p-2', 'border', 'shadow-sm', 'rounded', 'my-1'];

//отрисовка вопроса
function viewQuestion(objectQ) {
    //контеинер вопроса
    let bQ = document.createElement('div');
    //присваение стилей элементу
    classesBlockQ.map(x => {
        bQ.classList.add(x);
    });

    bQ.id = 'question-' + objectQ.id;

    //элемент вопроса
    let bP = document.createElement('p');
    //присваение стилей элементу
    classesBlockQ_elementP.map(x => {
        bP.classList.add(x);
    });

    //текст вопроса
    bP.innerText = objectQ.question;

    //контеинер ответов
    let bAS = document.createElement('div');
    //присваение стилей элементу
    classesBlockQ_elementAS.map(x => {
        bAS.classList.add(x);
    });

    //сами ответы
    for (let i = 0; i < objectQ.answers.length; i++) {
        const element = objectQ.answers[i];
        
        let bA = document.createElement('div');
        //присваение стилей элементу
        classesBlockQ_elementA.map(x => {
            bA.classList.add(x);
        });

        //атрибуты ответа
        bA.id = 'answer-' + element.id;
        bA.setAttribute('data-answer', element.isTrue);
        bA.setAttribute('data-questionid', bQ.id);
        bA.innerText = element.text;
        
        //если ранее было нажатие и статус нажатия (неправильный/правильный)
        if (element.checked == '0') {
            bA.classList.add('isFalse');
        } else if (element.checked == '1') {
            bA.classList.add('isTrue');
        }

        //если элемент содержит один из классов то не устанавливаем обработчик нажатия
        if (!bA.classList.contains('isFalse') || !bA.classList.contains('isTrue'))
            bA.addEventListener('mouseup', click_answer);

        //атрибут для быстрого поиска элемента
        bA.setAttribute('data-type', 'action');
        
        bAS.append(bA);
    }

    bQ.append(bP);
    bQ.append(bAS);
    //добавление вопроса на страницу
    document.querySelector('#main-block').append(bQ);
}

//отображение щита
function showShild(val){
    document.querySelector('.block-user-shild').style.display = val ? 'block' : 'none';
}

//отрисовка сердец
function setHeltBar(value, defaultValue = 3) {
    let bar = document.querySelector('.block-user-helth');
    for (let i = 0; i < defaultValue; i++) {
        const helthElement = createHelth(i + 1 <= value);
        bar.append(helthElement);
    }
}

//создание элементов жизней
function createHelth(status) {
    let img = document.createElement('img');
    img.src = status ? getSourceIcon('helth') : getSourceIcon('damage');
    img.setAttribute('data-status', status);
    img.alt = 'helth';
    return img;
}

//создание элемента сердца
function clearItemsHelth() {
    let hs = document.querySelector('.block-user-helth');
    while(hs.children.length > 0){
        const element = hs.children[0];
        element.remove();
    }
}

//задание визуального отображения ответа
function setViewAnswer(idAWithPrefix, flag) {
    let elQ = document.querySelector('#' + idAWithPrefix);
    elQ.classList.add(flag ? 'isTrue' : 'isFalse');
}

//блокировка интерфейса от нажатия и наоборот разблокировка
function lockInteface(flag){
    let btnBack = document.querySelector('#action-back');
    let btnsA = document.querySelectorAll('div[data-type="action"]');

    if (flag) {
        btnBack.removeEventListener('click', back);
        for (let i = 0; i < btnsA.length; i++)
            btnsA[i].removeEventListener('mouseup', click_answer);
    } else {
        btnBack.addEventListener('click', back);
        for (let i = 0; i < btnsA.length; i++)
            btnsA[i].addEventListener('mouseup', click_answer);
    }
}

//вернуться назад
function back() {
    location.href='themes.html';
}

//событие клика по ответу (e) - иницатор клика
async function click_answer(e){
    lockInteface(true);
    //атрибуты элемента id с префиксами
    let idAWithPrefix = e.target.id;
    let idQWithPrefix = e.target.getAttribute('data-questionid');
    //избавляемся от префиксов
    const idQ = parseInt(idQWithPrefix.replace('question-', ''));
    const idA = parseInt(idAWithPrefix.replace('answer-', ''));
    //Json объект тем
    let jsonObjectThemes = get_data_themes();
    //объект вопроса
    let questionObject = get_data_question_by_tq_id(jsonObjectThemes, idT, idQ);
    //передача параметров выбора пользователем этого ответа
    //result присвоет статус ответа true/false
    let result = set_data_answer(jsonObjectThemes, idT, idQ, idA);
    //визуально отмечаем выбор
    setViewAnswer(idAWithPrefix, result);

    //Конструкция async await позволяет сделать из асинхронного события вызова синхронное
    //В этому случае altruist вызовет модальное окно и метод вызовет блокировку в ожидании 
    //закрытия окна
    //т.е. ожидаем callback функции resolve. Она вызвется altruist-ом после закрытия окна
    
    //если выбранны ответ верный/неверный
    if (result == false){
        //ответ должен иметь свойство демедж для нанесения урона
        //если нет, поумолчанию ставим 1
        if (typeof(questionObject.damage) != 'number' || questionObject.damage < 0) 
            questionObject.damage = 1
        
        //проверяем наличие щита
        if (getUserShild()) {
            //вызываем альтруиста (если нужен)
            await new Promise((resolve, reject) => {
                altruist('damage-shild', resolve);
            });
            //убираем щит у игрока
            setUserShild(false);
            //вызываем анимацию исчезновения
            animationUserBar('damage-shild');
            //разблокировка интерфейса
            lockInteface(false);
        } else {
            //вызываем альтруиста (если нужен)
            await new Promise((resolve, reject) => {
                altruist('damage', resolve);
            });
            //получаем жизни игрока
            let userLives = getUserLives();
            //наносим урон
            userLives -= questionObject.damage;
            //чтоб не уйти в отрицательное значение
            userLives = userLives < 0 ? 0 : userLives;
            //присваеваем обновленные жизни
            setUserLives(userLives);
            //если жизни не закончились
            if (userLives > 0) {
                //визуально показываем урон
                viewDamage();
                //разблокировка интерфейса
                lockInteface(false);
            } else {
                //вызываем альтруиста (если нужен)
                await new Promise((resolve, reject) => {
                    altruist('null-helth', resolve);
                });
                //вызываем анимацию урона
                animationUserBar('damage');
                
                //сброс прогресса
                //получаем очки отвеченных вопросов у незавершенных тем
                let points = get_data_notT_qSuccess(jsonObjectThemes);
                let userPoints = getUserPoints();
                //вычетам очки у игрока
                userPoints -= points;
                userPoints = userPoints < 0 ? 0 : userPoints;
                setUserPoints(userPoints);
                setPoints(userPoints);
                setUserLives(2);
                setUserShild(false);
                //сбрасываем незавершенные темы
                reset_data_notSucces_themes(jsonObjectThemes);

                //Небольшая задержка перед переходом
                setTimeout(() => {
                    location.href = 'themes.html?reset=true';
                }, 2000);
            }
        }
    } else {
        //имеет ли ответ бонус щита
        if (questionObject.shild == true){
            //у игрока нет щита?
            if (getUserShild() == false) {
                //вызываем альтруиста (если нужен)
                await new Promise((resolve, reject) => {
                    altruist('shild', resolve);
                });
                //устанавливаем щит игроку
                setUserShild(true);
                //вызываем анимацию перемещения щита
                flowShild(e);
            }
            //вопрос имеет бонус жизни?
        } else if (questionObject.life > 0) {
            //у игрока не максимум жизней?
            if (getUserLives() < 3) {
                //вызываем альтруиста (если нужен)
                await new Promise((resolve, reject) => {
                    altruist('helth', resolve);
                });
                //обновляем жизни
                let userLives = getUserLives();
                userLives += questionObject.life
                userLives = userLives > 3 ? 3 : userLives;
                setUserLives(userLives);
                //вызываем анимацию перемещения сердца
                flowHelth(e);
            }
        }
        //обновляем очки игрока
        let userPoints = getUserPoints();
        userPoints += questionObject.points;
        setUserPoints(userPoints);
        setPoints(userPoints);
        //устанавливаем статус что вопрос отвечен
        set_data_question_success(jsonObjectThemes, idT, idQ);
        //получаем следующий вопрос
        let objectQuestion = get_data_notQ_next(jsonObjectThemes, idT);
        //если вопрос имеется
        if (objectQuestion != undefined) {
            //Небольшая задержка перед обновлением
            setTimeout((objectQuestion) => {
                //очищаем старый вопрос
                clearQuestion();
                //отрисовываем новый
                viewQuestion(objectQuestion);
            }, 1500, objectQuestion);
            
        } else {
            //Небольшая задержка перед переходом
            setTimeout(() => {
                location.href = 'themes.html?success=true';
            }, 2000);
        } 
    }
}
//визуальная анимация урона
function viewDamage(){
    animationUserBar('damage');
}
//полет сердца
function flowHelth(e) {
    flowElement(e, 'helth', animationUserBar);
}
//полет щита
function flowShild(e) {
    flowElement(e, 'shild', animationUserBar);
}
//анимация элементов бара игрока
function animationUserBar(key){
    let eLives;
    let helth;
    let shildBlock;
    let eShild;

    //это все для анимации бара игрока 
    switch(key){
        case 'helth':
            eLives = document.querySelector('.block-user-helth').children;
            //ищем сердце со статусом false
            for (let i = 0; i < eLives.length; i++) {
                let status = eLives[i].getAttribute('data-status');
                if (status == 'false'){
                    helth = eLives[i];
                    break;
                } 
            }
            //присваеваем новый статус в атрибутах
            helth.setAttribute('data-status', true);
            //берем изображение
            helth.src = getSourceIcon('helth');
            //добавляем класс css анимации масштабирования
            helth.classList.add('scale-and-object');
            //с задержкой удаляем этот класс
            setTimeout((helth) => { helth.classList.remove('scale-and-object') }, 1000, helth);
            break;
        case 'shild':
            //отрисовка щита
            showShild(true);
            shildBlock = document.querySelector('.block-user-shild').children;
            //сама картинка
            eShild = shildBlock[0];
            //добавляем класс css анимации масштабирования
            eShild.classList.add('scale-and-object');
            //с задержкой удаляем этот класс
            setTimeout((eShild) => { eShild.classList.remove('scale-and-object') }, 1000, eShild);
            break;
        case 'damage':
            eLives = document.querySelector('.block-user-helth').children;
            
            for (let i = 0; i < eLives.length; i++) {
                let status = eLives[i].getAttribute('data-status');
                if (status == 'true'){
                    //перебираем все сердца со статусом true
                    helth = eLives[i];
                } else {
                    //серце со статусом false Остановка перебора
                    break;
                }
            }
            //присваеваем новый статус в атрибутах
            helth.setAttribute('data-status', false);
            //добавляем класс css анимации масштабирования
            helth.classList.add('scale-and-object');
            //с задержкой удаляем этот класс
            //и залаем новую картинку
            setTimeout((helth) => { 
                helth.classList.remove('scale-and-object');
                helth.src = getSourceIcon('damage');
            }, 1000, helth);
            break;
        case 'damage-shild':
            shildBlock = document.querySelector('.block-user-shild').children;
            eShild = shildBlock[0];
            eShild.classList.add('scale-and-object');
            setTimeout((eShild) => { 
                eShild.classList.remove('scale-and-object');
                showShild(false);
            }, 1000, eShild);
            break;
    }
}

//ключ изображения (чтоб не писать постоянно пути)
function getSourceIcon(key){
    switch(key){
        case 'helth':
            return 'src/icons/heart_icon-icons.com_54429.ico';
        case 'damage':
            return 'src/icons/heart_icon-icons.com_48290.ico';
        case 'shild':
            return 'src/icons/shield.png';
    }
}

//плавающий элемент
//расчет координат, позици, размеров, откуда двигаться и куда
function flowElement(e, imgKey, callback) {
    //точка появления
    let element = e.target;
    let tileY = element.offsetTop;
    let tileX = element.offsetLeft;
    let tileW = element.offsetWidth;
    let tileH = element.offsetHeight;

    let centerW = parseInt(tileW / 2);
    let centerH = parseInt(tileH / 2);

    let flowX = tileX + centerW;
    let flowY = tileY + centerH;

    //элемент перемещения
    let flowElement = document.createElement('img');
    flowElement.src = getSourceIcon(imgKey);
    flowElement.width = 48;
    flowElement.height = 48;
    flowElement.style.position = 'absolute';
    flowElement.style.top = flowY + 'px';
    flowElement.style.left = flowX + 'px';
    flowElement.style.zIndex = 999;
    flowElement.style.backgroundColor = 'white';
    flowElement.style.borderRadius = 12 + 'px';
    flowElement.style.padding = 6 + 'px';
    
    //цель  
    let userBlock = document.querySelector('.block-user');
    let userY = userBlock.offsetTop;
    let userX = userBlock.offsetLeft;
    let userH = userBlock.offsetHeight;

    let userBottomY = userY + userH;
    userX += 50;

    //для того чтобы плавающий элемент имел абсолютное позиционирование относительно body
    document.querySelector('body').style.position = 'relative';
    document.querySelector('body').append(flowElement);

    //начать перемещение
    //так как весь процесс асинхронный оборачиваем в конструкцию async/await с использование Promise
    new Promise((resolve, reject) => {
        let element = target(flowElement, flowX, flowY, userX, userBottomY);
        //дожидаемся когда элемент достигнет цели
        resolve(element);
    }).then((e) => {
        e.remove();
        if (callback != undefined && typeof(callback) == 'function'){
            callback(imgKey);
        }
    });
}

//цель перемещения
async function target(element, x, y, targetX, targetY) {
    let posX = x;
    let posY = y;
    const speed = 500; //какая-то скорость
    //смещаемся относительно цели вниз
    let offsetY = 10;
    targetY = targetY - offsetY;
    //цикл пока не дойдем до цели
    while(posY > targetY) {
        //setTimeout - асинхронный метод. Оборачиваем в Promise
        //дожидаемся выполнения
        let data = await new Promise((resolve, reject) => {
            //setTimeout - вызовится с частотой обновления экрана 60hz
            setTimeout((element, x, y, targetX, targetY, speed, resolve) => {
                var vx = ((targetX - x)/((targetX - x)*(targetX - x) + (targetY - y)*(targetY - y)))*speed;
                var vy = ((targetY - y)/((targetX - x)*(targetX - x) + (targetY - y)*(targetY - y)))*speed;

                x += vx;
                y += vy;

                element.style.top = y + 'px';
                element.style.left = x + 'px';
                //возвращаем новые координаты
                resolve({x: x, y: y });
            }, 1000 / 60, element, posX, posY, targetX, targetY, speed, resolve);
        });
        //новые координаты
        posX = data.x;
        posY = data.y;
    }
    //сам элемент перемещения
    return element;
}