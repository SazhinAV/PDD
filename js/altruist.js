//фиктивное модальное окно
const myModal = document.getElementById('staticBackdrop')
//класс bootstrap
const myModalAlternative = new bootstrap.Modal(myModal);
//событие закрытия модального окна
myModal.addEventListener('hide.bs.modal', event_close);

//калбек закрытия окна (для отслеживания его закрытия внешними методами)
let altruist_callBackClose;

//задание текста для контента модального окна по ключу
function spicatator_text(key) {
    //элемент контента
    let content = document.querySelector('#spictator-comment');

    if (key == 'helth') {
        content.innerHTML = `
            Вы нашли дополнительную жизнь. Это позволяет пополнить шкалу здоровья
            <img src="src/icons/heart_icon-icons.com_48290.ico" width="16" height="16" alt="helth" srcset=""> -> <img src="src/icons/heart_icon-icons.com_54429.ico" width="16" height="16" alt="helth" srcset="">
            на случаи ошибок ответа на вопросы
        `;
        myModalAlternative.show('static');
    } else if (key == 'damage') {
        content.innerHTML = `
            На непраильный ответ вы тратите жизни
            <img src="src/icons/heart_icon-icons.com_54429.ico" width="16" height="16" alt="helth" srcset=""> -> <img src="src/icons/heart_icon-icons.com_48290.ico" width="16" height="16" alt="helth" srcset=""> Старайтесь отвечать правильно!
        `;
        myModalAlternative.show('static');
    } else if (key == 'shild') {
        content.innerHTML = `
            Вы нашли щит. Это защитит вас на случай неправильного ответа
            <img src="src/icons/shield.png" width="16" height="16" alt="helth" srcset="">
        `;
        myModalAlternative.show('static');
    } else if (key == 'damage-shild') {
        content.innerHTML = `
            Щит защитил ваши жизни от неправильного ответа. Отвечайте на вопрос внимательней!
        `;
        myModalAlternative.show('static');
    } else if (key == 'point') {
        content.innerHTML = `
            За правильный ответ вы получает очки +1
        `;
        myModalAlternative.show('static');
    } else if (key == 'null-helth') {
        content.innerHTML = `
            Ваши жизни к сожалению закончились 
            <img src="src/icons/heart_icon-icons.com_48290.ico" width="16" height="16" alt="helth" srcset="">
            <img src="src/icons/heart_icon-icons.com_48290.ico" width="16" height="16" alt="helth" srcset="">
            <img src="src/icons/heart_icon-icons.com_48290.ico" width="16" height="16" alt="helth" srcset="">
        `;
        myModalAlternative.show('static');
    } else if (key == 'clear-progress') {
        content.innerHTML = `
            Вы потратили все жизни отвечая неправильно - это сбросит весь накопленный прогресс незавершенных тем. Накопленные очки на завершенных темах сохраняться
            <span class="badge rounded-pill bg-danger">4/6</span> -> <span class="badge rounded-pill bg-danger">0/6</span> и 
        `;
        myModalAlternative.show('static');
    } else if (key == 'themes') {
        content.innerHTML = `
            Выберайте темы по вкусу, отвечайте на интересные вопросы и 
            зарабатывайте очки. Прогресс ответов: 
            <span class="badge rounded-pill bg-danger">0/6</span> -> <span class="badge rounded-pill bg-danger">5/6</span> 
        `;
        myModalAlternative.show('static');
    } else if (key == 'question') {
        content.innerHTML = `
            Ответ на вопрос только один. Не ошибись! Удачи :)
        `;
        myModalAlternative.show('static');
    } else if (key == 'theme-success') {
        content.innerHTML = `
            Поздравляю с завершением первой темы. Так держать!
        `;
        myModalAlternative.show('static');
    } else if (key == 'finished') {
        content.innerHTML = `
            Поздравляю с завершением всех тем! Ждите обновлений :)
        `;
        myModalAlternative.show('static');
    } else if (key == 'finished-repeat') {
        content.innerHTML = `
            Вы уже ответили на все вопросы! Ждите обновлений :)
        `;
        myModalAlternative.show('static');
    }
}

//событие закрытия окна
function event_close() {
    if (altruist_callBackClose != undefined && typeof(altruist_callBackClose) == 'function'){
        //вызов калбека для внешних функций
        altruist_callBackClose();
    }
}

//функция альтруиста 
//keyHelper - ключ контента
//callback - внешняя переданная функция
function altruist(keyHelper, callback){
    //объект игрока
    let jsonObjectUser = get_data_user();
    //ищем у игрока переданный ключ со статусом true
    let keyHelperShow = jsonObjectUser.spictatorHelp.filter(x => {
        const key = Object.keys(x)[0];
        return key == keyHelper && x[key];
    }).length > 0;

    //если ключ имеет имя finished и ранее оно вызывалось
    if (keyHelper == 'finished' && !keyHelperShow) {
        //принудиьельно ставим keyHelperShow = true
        keyHelperShow = true;
        //меняем ключ на другой
        keyHelper = 'finished-repeat';
    }

    //если нашли ключ с нужным условием
    if (keyHelperShow) {
        //устанвливаем калбек функцию
        altruist_callBackClose = callback;
        //задаем текст
        spicatator_text(keyHelper);
        //устанавливаем состояние ключа у объекта игрока
        jsonObjectUser.spictatorHelp.map(x => {
            const key = Object.keys(x)[0];
            if (keyHelper == key){
                x[key] = false;
            }
        })
        //сохраняем игрока в лок. хранилище
        localStorage.setItem('kMyUser', JSON.stringify(jsonObjectUser));

        //если ключ не нашли
    } else {
        //вызываем калбек если он есть
        //завершаем вызов альтруиста вызвав callback
        if (callback != undefined && typeof(callback) == 'function')
            callback();
        //если калбек не передан
        //завешается функция альтруиста
    }
}