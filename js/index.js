//событие ввызовет функцию (лямбда функция - укороченная версия обычной) когда страница отрисуется
window.onload = () => {
    //проверяем загружены ли темы в локальное хранилище
    if (is_load_data_themes()){
        //проверяем даты локального хранилища и исходного файла
        //если дата новая то обновляем темы сохраняя прогресс игрока
        if (is_update_date_themes()) {
            //объединяем темы с сохранением прогресса
            let jsonObject = union_data_themes();
            //сохраняем в локальное хранилище
            save_data_themes(jsonObject);
        }
    } else {
        //темы не загружены
        //берем их из исходного файла
        let jsonObject = get_load_data_themes();
        //если файл считан успешно
        if (jsonObject != undefined) {
            //сохраняем темы в локальное хранилище
            save_data_themes(jsonObject);
        }
    }
}

//сброс прогресса игрока
function reset_data(){
    //получение тем из лок.хранилища
    let jsonObject = get_data_themes();
    if (jsonObject != undefined){
        //удаляем темы
        remove_data_themes();
        //грузим из исходного файла
        jsonObject = get_load_data_themes();
        //сохраняем
        save_data_themes(jsonObject);
    }

    //получаем игрока
    let jsonObjectUser = get_data_user();
    if (jsonObjectUser != undefined){
        //сбрасываем прогресс, но сохраняем статусы подсказок альтруиста
        jsonObjectUser = defaultUserSaveStateHelper(jsonObjectUser);
        //сохраняем игрока в лок.хранилище
        save_data_user(jsonObjectUser);
    }
}
