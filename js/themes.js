//вызовится когда страница полностью отричуется
window.onload = async () => {
    //темы
    let jsonObject = get_data_themes();
    //игрок
    let jsonObjectUser = get_data_user();
    //отрисовка очков
    setPoints(jsonObjectUser.points);
    //отрисовка тем
    buildTiles(jsonObject);

    //вызов альтруиста (если по данному ключу небыл вызван ранее)
    //альтруист вызывает фиктивное модальное окно по сути это обычные элемент
    //поверх всех и он не блокирует вызов последующих инструкций (код ниже)
    //для того чтобы вызвать блокировку необходимо функцию инициатор(родитель) оберуть в async 
    //а вызываемую функцию оберуть в await Promise и передать в метод altruist функцию калбека(resolve)
    //внутри функции altruist произойдет вызов переданной функции resolve и Promise выполнится сняв блокировку выполнения
    //если убрать await то промис не вызовет блокировку и вернет обещание выполнения до того как выполнится altruist
    //*эмитация асинхронной работы

    await new Promise((resolve, reject) => {
        altruist('themes', resolve);
    });

    await new Promise((resolve, reject) => {
        let val = get_param('reset');
        if (val == 'true'){
            altruist('clear-progress', resolve);
        } else {
            resolve();
        }
    });

    await new Promise((resolve, reject) => {
        let val = get_param('success');
        if (val == 'true'){
            altruist('theme-success', resolve);
        } else {
            resolve();
        }
    });

    await new Promise((resolve, reject) => {
        //есть ли незавершенные темы
        let themes = get_data_notSuccess_themes(jsonObject);
        if (themes.length == 0){
            altruist('finished', resolve);
        } else {
            resolve();
        }
    });
}

//визуальное отображение очков
function setPoints(points) {
    document.querySelector('#points').innerText = 'Очки: ' + points;
}

//создние элементов тем
function buildTiles(themes) {
    //контеинер тем
    let blockThemes = document.querySelector('.block-themes');
    //перебор тем
    for (let i = 1; i < themes.length; i++) {
        const element = themes[i];
        const id = themes[i].id;
        //кол-во отвеченных вопросов
        const countA = element.questions.filter(x => x.success == true).length;
        //всего вопросов
        const totalQ = element.questions.length;
        //создание элемента темы
        const tObject = buildTile(totalQ, countA, id, element.name);
        //отрисовка элемента
        blockThemes.append(tObject);
    }
}

//классы элемента темы
let classesBlockTheme = ['block-theme', 'position-relative', 'mx-auto', 'shadow-sm'];
let classesBadge = ['position-absolute', 'top-0', 'start-100', 'translate-middle', 'badge', 'rounded-pill', 'bg-danger'];

//создание элемента темы
function buildTile(totalQ, countA, idT, text) {
    //элемент темы
    let div = document.createElement('div');
    //добавление css классов элементу
    classesBlockTheme.map(x => {
        div.classList.add(x);
    });

    //Если все вопросы отвечены не ставим обработчик клика
    if (countA < totalQ)
        div.addEventListener('click', () => location.href='questions.html?idT=' + idT);
    //текст темы
    div.innerText = text;

    //статус ответов
    let span = document.createElement('span');
    classesBadge.map(x => {
        span.classList.add(x);
    });

    span.innerText = countA + '/' + totalQ;

    div.append(span);
    
    return div;
}


