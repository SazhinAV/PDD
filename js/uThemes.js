//получение незавершенных тем
function get_data_notSuccess_themes(jsonObjectThemes) {
    let themes = [];

    for (let i = 1; i < jsonObjectThemes.length; i++) {
        let notSuccess = false;
        //Убекждаемся что в теме есть неотвеченные вопросы
        let objectQsNotSuccess = jsonObjectThemes[i].questions.filter(x => x.success == false);
        if (objectQsNotSuccess.length > 0){
            notSuccess = true;
        }

        if (notSuccess){
            themes.push(jsonObjectThemes[i]);
        }
    }

    return themes;
}

//получение темы из локального хранилища
function get_data_themes(){
    try{
        let json = localStorage.getItem('kMyData');
        return JSON.parse(json);
    }catch(e){
        console.log(e)
    }
}

//получение темы по id
function get_data_theme_by_id(jsonObjectThemes, idT) {
    for (let i = 1; i < jsonObjectThemes.length; i++) {
        if (jsonObjectThemes[i].id == idT) {
            return jsonObjectThemes[i];
        }
    }
}

//получение вопроса по id
function get_data_question_by_tq_id(jsonObjectThemes, idT, idQ) {
    for (let i = 1; i < jsonObjectThemes.length; i++) {
        if (jsonObjectThemes[i].id == idT){
            for (let j = 0; j < jsonObjectThemes[i].questions.length; j++) {
                if(jsonObjectThemes[i].questions[j].id == idQ) {
                    return jsonObjectThemes[i].questions[j];
                }
            }
        }
    }
}

//Получение очков незавершенных тем
function get_data_notT_qSuccess(jsonObjectThemes){
    let points = 0;
    for (let i = 1; i < jsonObjectThemes.length; i++) {
        //Убекждаемся что в теме есть неотвеченные вопросы
        let objectQsNotSuccess = jsonObjectThemes[i].questions.filter(x => x.success == false);
        if (objectQsNotSuccess.length > 0){
            //Берем те на которые ответели
            let objectQsSuccess = jsonObjectThemes[i].questions.filter(x => x.success == true);
            for (let k = 0; k < objectQsSuccess.length; k++) {
                //Суммируем за них очки
                points += objectQsSuccess[k].points;
            }
        }
    }

    console.log('Очки незакрытых тем: ' + points);
    return points;
}

//isTrue - задает статус отображения checked
//default value checked = ""
//если пользователь кликнул по isTrue == false -> checked = "0"
//если пользователь кликнул по isTrue == true -> checked = "1"
function set_data_answer(jsonObjectThemes, idT, idQ, idA) {
    let objectQ = get_data_question_by_tq_id(jsonObjectThemes, idT, idQ);
    let checked = ''
    for (let i = 0; i < objectQ.answers.length; i++) {
        if (objectQ.answers[i].id == idA) {
            if (objectQ.answers[i].isTrue){
                checked = "1";
            } else {
                checked = "0";
            }
            objectQ.answers[i].checked = checked;
            break;
        }
    }

    save_data_themes(jsonObjectThemes);

    return checked == "1";
}

//обнуление прогресса темы
function reset_data_notSucces_themes(jsonObjectThemes) {
    let loadDataThemes = get_load_data_themes();
    for (let i = 1; i < jsonObjectThemes.length; i++) {
        let notSucces = false;
        for (let j = 0; j < jsonObjectThemes[i].questions.length; j++) {
            //Убекждаемся что в теме есть неотвеченные влпросы
            let objectQsNotSuccess = jsonObjectThemes[i].questions.filter(x => x.success == false);
            if (objectQsNotSuccess.length > 0){
                notSucces = true;
                break;
            }
        }

        if (notSucces) {

            for (let j = 0; j < loadDataThemes.length; j++) {
                if (jsonObjectThemes[i].id == loadDataThemes[j].id) {
                    jsonObjectThemes[i] = loadDataThemes[j];
                    break;
                }
            }
        }
    }

    save_data_themes(jsonObjectThemes);
}

//задание вопросу статуса завершен
function set_data_question_success(jsonObjectThemes, idT, idQ) {
    let objectQ = get_data_question_by_tq_id(jsonObjectThemes, idT, idQ);
    objectQ.success = true;
    save_data_themes(jsonObjectThemes);
}

//получение вопросов со статусом success == false и перемешивание random
function get_data_notQs_random(jsonObjectThemes, idT){
    let objectsQ = get_data_notQ(jsonObjectThemes, idT);
    let idQ = objectsQ.map(x => x.id);
    shuffle(idQ);
    let outQ = [];
    for (let i = 0; i < idQ.length; i++) {
        for (let j = 0; j < objectsQ.length; j++) {
            if (objectsQ[j].id == idQ[i]){
                outQ.push(objectsQ[j]);
                break;
            }
        }
    }

    return outQ;
}

//вопрос со статусом success == false из перемешанных
//конечно условие есть ли вопрос на который начали отвечать. Если есть хотябы один ответ со статусом checked != ''
function get_data_notQ_next(jsonObjectThemes, idT) {
    let onlyNotSuccessQuestions = get_data_notQs_random(jsonObjectThemes, idT);
    if (onlyNotSuccessQuestions.length > 0){

        for (let i = 0; i < onlyNotSuccessQuestions.length; i++) {
            let answers = onlyNotSuccessQuestions[i].answers;
            let answersCheked = answers.filter(x => x.checked != '');
            if (answersCheked.length > 0){
                return onlyNotSuccessQuestions[i];
            }
        }

        return onlyNotSuccessQuestions[0];
    }
}

//вопросы со статусом success == false
function get_data_notQ(jsonObjectThemes, idT){
    for (let i = 1; i < jsonObjectThemes.length; i++) {
        if (jsonObjectThemes[i].id == idT) {
            return jsonObjectThemes[i].questions.filter(x => x.success == false);
        }
    }
}

//рандомно меняем порядок id
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}

//обновление тем в локальном хранилище с файлом json
function union_data_themes(){
    let jObjDT = get_data_themes();
    let jObjLD = get_load_data_themes();

    for (let i = 1; i < jObjLD.length; i++) {
        for (let j = 1; j < jObjDT.length; j++) {
            if (jObjLD[i].id == jObjDT[j].id){
                union_themes(jObjLD[i], jObjDT[j]);

                union_questions(jObjLD[i].questions, jObjDT[j].questions);
            }
        }
    }

    return jObjLD;
}

//объединение вопросов
function union_questions(qL, qD) {

    for (let i = 0; i < qL.length; i++) {
        for (let j = 0; j < qD.length; j++) {
            if (qL[i].id == qD[j].id){
                union_question(qL[i], qD[j]);

                union_answer(qL[i].answers, qD[j].answers);
            }
        }  
    }
}

//объединение вопроса
function union_question(qL, qD) {
    let qDKeys = Object.keys(qD);
    let qLKeys = Object.keys(qL);

    for (const i in qLKeys) {
        
        for (const j in qDKeys) {
            
            if (qLKeys[i] == qDKeys[j] && qLKeys[i] == 'success' && typeof(qD[qLKeys[i]]) != 'object') {
                //Заменям только прогресс success пользовательским
                qL[qLKeys[i]] = qD[qDKeys[j]];

            }
        }
    }
}

//объединение ответов
function union_answer(aL, aD) {
    let aDKeys = Object.keys(aD);
    let aLKeys = Object.keys(aL);

    for (const i in aLKeys) {
        
        for (const j in aDKeys) {
            //Заменяем все пользователльским прогрессом кроме текста вопроса и массивов
            if (aLKeys[i] == aDKeys[j] && aLKeys[i] != 'text' && typeof(aL[aLKeys[i]]) != 'object') {
                aL[aLKeys[i]] = aD[aDKeys[j]];
            }
        }
    }
}

//объединение тем
function union_themes(tL, tD){
    let tDKeys = Object.keys(tD);
    let tLKeys = Object.keys(tL);

    for (const i in tLKeys) {
        
        for (const j in tDKeys) {
            
            if (tLKeys[i] == tDKeys[j] && tLKeys[i] != 'name' && typeof(tD[tLKeys[i]]) != 'object') {
                //Заменяем все кроме name и массивов
                tL[tLKeys[i]] = tD[tDKeys[j]];

            }
        }
    }
}

//проверка на обновление
function is_update_date_themes() {
    let load_themes_date = get_load_date_themes();
    let data_themes_date = get_data_date_themes();
    return load_themes_date > data_themes_date;
}

//получение даты тем из локального хранилища
function get_data_date_themes() {
    let jsonObjectThemes = get_data_themes();
    return get_date_themes(jsonObjectThemes);
}

//получение даты тем из файла json
function get_load_date_themes() {
    let jsonObjectThemes = get_load_data_themes();
    return get_date_themes(jsonObjectThemes);
}

//получение даты из загруженного объекта json
function get_date_themes(jsonObjectThemes) {
    let date;
    if (jsonObjectThemes == undefined){
        date = Date.parse("0001-01-01");
    } else {
        try{
            date = Date.parse(jsonObjectThemes[0].date);
        }catch(e){
            date = Date.parse("0001-01-01");
        }
    }

    return date;
}

//мохранение тем в локальное хранилище
function save_data_themes(jsonObjectThemes) {
    try{
        localStorage.setItem('kMyData', JSON.stringify(jsonObjectThemes));
    }catch(e){
        console.log(e);
    }
}

//перезапись локального хранилища
function reset_data_themes(){
    try {
        remove_data_themes();
        get_load_data_themes();
    }catch(e){
        console.log(e);
    }
}

//удаление тем из локального хранилища
function remove_data_themes() {
    localStorage.removeItem('kMyData');
}

//получение тем из файла json
function get_load_data_themes() {
    try{
        let jsonObject = JSON.parse(data);
        if (jsonObject != undefined && jsonObject != null) {
            return jsonObject;
        }
    }catch(e){
        console.log(e);
    }
}

//проверка на существование тем в локальном хранилище
function is_load_data_themes(){
    try{
        let json = localStorage.getItem('kMyData');
        let jsonObject = JSON.parse(json);
        return jsonObject != null && jsonObject != undefined;
    }catch(e){
        return false;
    }
}