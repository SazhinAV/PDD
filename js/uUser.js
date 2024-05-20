
//получение игрока из лок.хранилища
function get_data_user() {
    try{
        let json = localStorage.getItem('kMyUser');
        //если игрока нет в лок.хран. вызываем exception
        if (json == null) throw 'nyll object user';
        return JSON.parse(json);
    }catch(e){
        console.log(e);
        //создаем объект игрока по умолчанию
        return defaultUser();
    }
}

//объект игрока по умолчанию
function defaultUser() {
    return {
        points: 0,
        lives: 2,
        shild: false,
        spictatorHelp: [
            { "helth": true },
            { "damage": true },
            { "shild": true },
            { "damage-shild": true },
            { "point": true },
            { "clear-progress": true },
            { "null-helth": true },
            { "themes": true },
            { "question": true },
            { "theme-success": true },
            { "finished": true },
            { "finished-repeat": true }
        ]
    }
}

//сохранение статуса подсказок альтруиста и состоние игрока по умолчанию
function defaultUserSaveStateHelper(jsonObjectUser) {
    let _defaultUser = defaultUser()
    for (const i in _defaultUser.spictatorHelp) {
        const keys1 = Object.keys(_defaultUser.spictatorHelp[i]);
        for (const j in jsonObjectUser.spictatorHelp) {
            const keys2 = Object.keys(jsonObjectUser.spictatorHelp[j]);
            for (const k in keys1) {
                for (const n in keys2) {
                    if (keys1[k] == keys2[n] && jsonObjectUser.spictatorHelp[j][keys2[n]] == false) {
                        _defaultUser.spictatorHelp[i][keys1[k]] = jsonObjectUser.spictatorHelp[j][keys2[n]];
                    }
                }
            }
        }
    }
    return _defaultUser;
}

//сохранение игрока в лок. хранилище
function save_data_user(jsonObjectUser) {
    localStorage.setItem('kMyUser', JSON.stringify(jsonObjectUser));
}

//получение очков игрока
function getUserPoints() {
    let user = get_data_user();
    return user.points;
}

//получение жизней игрока
function getUserLives(){
    let user = get_data_user();
    return user.lives;
}

//получение щита игрока
function getUserShild(){
    let user = get_data_user();
    return user.shild;
}

//задание игроку новых очков
function setUserPoints(points){
    let user = get_data_user();
    user.points = points;
    save_data_user(user);
}

//задание игроку новых жизней
function setUserLives(lives){
    let user = get_data_user();
    user.lives = lives;
    save_data_user(user);
}

//задание игроку состояние щита
function setUserShild(flag){
    let user = get_data_user();
    user.shild = flag;
    save_data_user(user);
}