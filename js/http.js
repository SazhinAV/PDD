//парсинг строки из url для получения параметра
function get_param(param) {
    const regex = new RegExp('(\\?'+param+'=[A-zA-zА-яА-Я\\d]+&)|('+param+'=[A-zA-zА-яА-Я\\d]+&)|('+param+'=[A-zA-zА-яА-Я\\d]+)', 'i');
    let match = regex.exec(location.href);
    if (match != null){
        if (match.length > 0){
            return match[0].split('=')[1];
        }
    }
}