ymaps.ready(init);
var coords;

function init() {
    var myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 8,
            controls: []
        }, {
            searchControlProvider: 'yandex#search'
        });

        myMap.controls.add('zoomControl');
        myMap.behaviors.disable(['dblClickZoom']);
        

        objectManager = new ymaps.ObjectManager({
            // Чтобы метки начали кластеризоваться, выставляем опцию.
            clusterize: true,
            // ObjectManager принимает те же опции, что и кластеризатор.
            gridSize: 32,
            clusterDisableClickZoom: true,
           // iconImageHref: '/img/pin.png',
           // iconLayout: 'default#image',
                // Своё изображение иконки метки.
             //   iconImageHref: 'img/pin.png',
                // Размеры метки.
               // iconImageSize: [30, 42],
                // Смещение левого верхнего угла иконки относительно
                // её "ножки" (точки привязки).
               // iconImageOffset: [-5, -38]
        });

    // Чтобы задать опции одиночным объектам и кластерам,
    // обратимся к дочерним коллекциям ObjectManager.
    //objectManager.objects.options.set('preset', 'islands#greenDotIcon');
    //objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    objectManager.objects.options.set('preset', {
        iconLayout: 'default#image',
        iconImageHref: 'img/pin.png',
        iconImageSize: [30, 42],
        iconImageOffset: [-5, -38]
    });

    myMap.geoObjects.add(objectManager);

    var data = {
        "type": "FeatureCollection",
        "features": [],
    }
    var formData = JSON.parse(localStorage.getItem("objectData"));
    if(Array.isArray(formData)){
        formData.forEach(function (item, i, formData) {

            data.features.push(
                {
                    "type": "Feature",
                    "id": i,
                    "geometry": {
                        "type": "Point",
                        "coordinates": item.coords.split(':')
                    }
                }
            );
        });
    }

    objectManager.add(data);

    function onObjectEvent(e) {
        var objectId = e.get('objectId');
        if (e.get('type') == 'click') {
            coords = objectManager.objects.getById(e.get('objectId')).geometry.coordinates;
            //           console.log(coords);
            openModal(e);
        }
    }

    objectManager.objects.events.add('click', onObjectEvent)
    //функция открытия модалки

    function openModal(event) {
        var coordsStr = coords[0] + ":" + coords[1];

        document.querySelector('.review-list').innerHTML = '';
        document.querySelector('.modal-address').innerHTML = '';

        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);
            document.querySelector('.modal-address').innerHTML = firstGeoObject.getAddressLine();

        });

        var formData = JSON.parse(localStorage.getItem("objectData"));
        if(Array.isArray(formData)){

            formData.forEach(function (item, i, formData) {
                if (item.coords == coordsStr) {
                    //console.log(item.data);
                    
                    item.data.forEach(function ( item_,i_) {
                        document.querySelector('.review-list').innerHTML += 
                        '<div class="item-review"><div class="item-data"><div class="name"><strong>'
                        +item_.name+'</strong></div><div class="address"><h4>'
                        +item_.address+'</h4></div></div><div class="text"><p>'
                        +item_.text+'</p></div></div>';
                        console.log(i_);
                    });

                }
            });

          
        }

        let posX = event.getSourceEvent().originalEvent.domEvent.originalEvent
            .clientX;
        let posY = event.getSourceEvent().originalEvent.domEvent.originalEvent
            .clientY;

        const modal = document.querySelector('.modal');

        modal.style.left = `${posX}px`;
        modal.style.top = `${posY}px`;
        modal.style.display = 'block';
    }

    myMap.events.add("click", function (event) {
        coords = event.get("coords");
//        console.log(coords);
        openModal(event);
    });
    //добавление отзыва
    const addButtonReview = document.querySelector('.add-review');

    addButtonReview.addEventListener('click', (e) => {
        const addNameInput = document.querySelector('.review-name').value.trim();
        const addAddressInput = document.querySelector('.review-place').value.trim();
        const addTextInput = document.querySelector('.review-text').value.trim();
        //условие на заполнение полей формы
        var formData = JSON.parse(localStorage.getItem("objectData"));

        var coordsStr = coords[0] + ":" + coords[1];
        var found = false;
        if(Array.isArray(formData)){

            formData.forEach(function (item, i, formData) {
                if (item.coords == coordsStr) {
                    formData[i].data.push({
                        name: addNameInput,
                        address: addAddressInput,
                        text: addTextInput
                    });
                    found = true;
                }
            });
        }
        else{
            var formData = [];
        }

        if (!found) {
            formData.push({
                coords: coordsStr,
                data: [{
                    name: addNameInput,
                    address: addAddressInput,
                    text: addTextInput
                }]
            });
        }

        localStorage.setItem("objectData", JSON.stringify(formData));
        location.reload();
    });

    document.getElementById('remove-button').onclick = function() {
        console.log('клик скрыть модалку');
        modal.style.display = 'none';
    }
}