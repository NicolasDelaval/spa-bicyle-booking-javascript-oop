// 1. Display/Hide Slider Feature
// 1.1 Display/Hide Slider Object
var DisplayHelp = {
    //1.2 Object properties
    buttonShowHideHelp: null,
    displayed: true,
    //1.3 Object methods
    //1.3.1 Initialize method
    initialize: function() {
        this.buttonShowHideHelp = $("#displayCarousel");
        this.bookingZone= $("#bookingZone");
        this.showOrHideHelp();
    },
    //1.3.2 Toggle slider method
    showOrHideHelp: function() {
        var self = this;
        $(this.buttonShowHideHelp).click(function() {
            var x = $("#carouselContainer");
            if (self.displayed) {
                $(x).hide();
                self.buttonShowHideHelp.text("Afficher l'aide");
                self.bookingZone.css({"margin-top": "25px", "margin-bottom":"75px"});
                self.displayed = false;
            } else {
                $(x).show();
                self.displayed = true;
                self.buttonShowHideHelp.text("Masquer l'aide");
            }
        });
    }
}
// 2. Slider Feature
// 2.1 Slider Object
var Diapo = {
    //2.2 Object properties
    slide: $(".slide"),
    indexLastSlide: $(".slide").length - 1,
    i: 0,
    currentSlide: $(".slide").eq(this.i),
    play: $('#play'),
    pause: $('#pause'),
    prev: $('#prev'),
    next: $('#next'),
    //2.3 Object methods
    //2.3.1 initialize method
    initialize: function() {
        $(self.play).hide();
        this.showActiveSlide();
        this.slideIndexPlus();
        this.slideIndexMinus();
        this.autoPlayAndPause();
        this.playAutoClick();
        this.nextSlideOnClick();
        this.prevSlideOnClick();
        this.changeSlideOnKeypress();
    },
    //2.3.2 Display active slide method
    showActiveSlide: function() {
        this.slide.hide();
        this.currentSlide = $(".slide").eq(this.i)
        this.currentSlide.css('display', 'block');
    },
    //2.3.4 Slide index plus method
    slideIndexPlus: function() {
        this.i++;
        if (this.i <= this.indexLastSlide) {
            this.currentSlide = $(".slide").eq(this.i);
        } else {
            this.i = 0;
        }
    },
    //2.3.5 Slide index minus method
    slideIndexMinus: function() {
        this.i--;
        if (this.i >= 0) {
            this.currentSlide = $(".slide").eq(this.i);
        } else {
            this.i = this.indexLastSlide;
        }
    },
    //2.3.5 Auto play/ pause slide method
    autoPlayAndPause: function() {
        var self = this;
        $(this.play).click(function() {
            var playingAuto = setInterval(function() {
                self.slideIndexPlus();
                self.showActiveSlide();
            }, 5000);
            $(self.pause).show();
            $(self.pause).click(function() {
                clearInterval(playingAuto);
                $(self.pause).hide();
                $(self.play).show();
            });
        });
    },
    //2.3.6 Start autoplay method : emulate click on "play button"
    playAutoClick: function() {
        $(this.play).trigger('click');
    },
    //2.3.7 Display next slide method
    nextSlideOnClick: function() {
        var self = this;
        $(this.next).click(function() {
            self.slideIndexPlus();
            self.showActiveSlide();
        });
    },
    // 2.3.8 Display previous slide method
    prevSlideOnClick: function() {
        var self = this;
        $(this.prev).click(function() {
            self.slideIndexMinus();
            self.showActiveSlide();
        });
    },

    // 2.3.9 Display previous / next slide method using keypress on left and right arrow keys
    changeSlideOnKeypress: function() {
        var self = this;
        $('body').keydown(function(e) {
            if (e.which === 39) {
                self.slideIndexPlus();
                self.showActiveSlide();
            } else if (e.which === 37) {
                self.slideIndexMinus();
                self.showActiveSlide();
            }
        });
    },
}
//3. Calling JC Decaux API feature
//3.1 Get API object
var GetDataApi = {
    //3.2 Object properties
    apiJcDecaux: "https://api.jcdecaux.com/vls/v1/stations?contract=Nantes&apiKey=cf8706e736f8cf09746a28fc952da2089dfe8b49",
    marker: null,
    //3.3 Object methods
    //3.3.1 Initialize method
    initialize: function(callback) {
        this.callApi(callback);
    },
    //3.3.2 Call API method
    callApi: function(callback) {
        ajaxGet(this.apiJcDecaux, function(response) {
            var stations = JSON.parse(response);
            callback(stations)
        });
    },
}
//4. Set up session and local storage
//4.1 Storage Object
var Storage = {
    //4.2 Object properties
    userLname: $('#last_name'),
    userFname: $('#first_name'),
    //4.3 OBject methods
    //4.3.1 Initialize method
    initialize: function() {
        this.getUser();
    },
    //4.3.2 Local storage user's info set item method
    addUser: function() {
        var userItems = [$(this.userLname).val(), $(this.userFname).val()];
        localStorage.setItem('userDatas', JSON.stringify(userItems));
    },
    //4.3.3 Local storage user's info get item method
    getUser: function() {
        var storedValues = JSON.parse(localStorage.getItem('userDatas'));
        if (storedValues) {
            $(this.userLname).val(storedValues[0]);
            $(this.userFname).val(storedValues[1]);
        }
    },
    //4.3.4 Session storage station's info set item method
    addStation: function(station) {
        var stationsItems = station;
        sessionStorage.setItem('stationsData', JSON.stringify(stationsItems));
    },
    //4.3.5 Session storage station's info get item method
    getStation: function() {
        return JSON.parse(sessionStorage.getItem('stationsData'));
    },
    //Crer session storage pour station definitivement réservée.
    addStationBooked : function(station){
      var stationsItems = station;
      sessionStorage.setItem('stationBooked',stationsItems);
    },

    getStationBooked : function(){
       return sessionStorage.getItem('stationBooked');
    }
}
//5. Set up station card to display station info
//5.1 Station card Object
var StationCard = {
    //5.2 Object properties
    stationName: null,
    stationNameTxt: $('.nom'),
    stationAdress: null,
    stationAdressTxt: $('.adresse'),
    stationAvailableBikes: null,
    stationAvailableBikesTxt: $('.nbvelosdispos'),
    stationAvailablePlaces: null,
    stationAvailablePlacesTxt: $('.nbplace'),
    userLname: $('#last_name'),
    userFname: $('#first_name'),
    btnBook: $('#reserver'),
    btnCancel: $('#cancel_booking'),
    storage: null,
    canvas: null,
    //5.3 Object methods
    //5.3.1 Initialize method
    initialize: function(params) {
        this.canvas = params.canvas;
        this.storage = params.storage;
        this.clickOnbtnBookEvents();
        this.clickOnCancelEvents();
        var station = this.storage.getStation();
        if (station) {
            this.stationName = station.name;
            this.stationAdress = station.address;
            this.stationAvailableBikes = station.available_bikes;
            this.stationAvailablePlaces = station.available_bike_stands;
            this.displayInfosStations();
        }
    },
    //5.3.2 Set infos' station method
    setStation: function(station) {
        this.stationName = station.name;
        this.stationAdress = station.address;
        this.stationAvailableBikes = station.available_bikes;
        this.stationAvailablePlaces = station.available_bike_stands;
    },
    //5.3.3 Display infos' station method
    displayInfosStations: function() {
        $(".nom").text(this.stationName.substring(7));
        $(".adresse").text(this.stationAdress);
        $(".nbvelosdispos").text(this.stationAvailableBikes);
        $(".nbplace").text(this.stationAvailablePlaces);
    },
    //5.3.4 Form control method : check that user picked a station or / and input his firstname and lastname
    formControl: function(station) {
        var x = $(this.userLname).val();
        var y = $(this.userFname).val();
        if (x == "") {
            alert("Veuillez renseigner votre nom");
        } else if(y == ""){
            alert("Veuillez renseigner votre prénom");
        }
        else {
            this.btnBook.show();
            this.storage.addUser();
            this.storage.getUser();
            this.updateStationInfos();
            this.btnBook.hide();
            this.canvas.showCanvas();
        }
    },
    //5.3.5 Update available bikes and available parking places when a station is booked method
    updateStationInfos: function(stationName, stationAvailableBikes, stationAvailablePlaces) {
        var self = this;
        if (this.station == sessionStorage.station) {
            this.stationAvailableBikes = (this.stationAvailableBikes - 1);
            $(".nbvelosdispos").text(this.stationAvailableBikes);
            this.stationAvailablePlaces = (this.stationAvailablePlaces + 1);
            $(".nbplace").text(this.stationAvailablePlaces);
        }
    },
    //5.3.6 Events triggered by clicking on "book button" method
    clickOnbtnBookEvents: function() {
        var self = this;
        $(this.btnBook).click(function() {
            self.formControl();

        });
    },
    //5.3.7 Events triggered by clicking on "cancel button" method
    clickOnCancelEvents: function(station, stationAvailableBikes, stationAvailablePlaces) {
        var self = this;
        $(this.btnCancel).click(function() {
            localStorage.clear();
            sessionStorage.clear();
            $(self.userLname).val('');
            $(self.userFname).val('');
            $(self.stationNameTxt).text('');
            $(self.stationAdressTxt).text('');
            $(self.stationAvailableBikesTxt).text('');
            $(self.stationAvailablePlacesTxt).text('');
        });
    }
}
//6. City Map built with google map API
//6.1 Map Object
var MyMap = {
    //6.2 Object properties
    btnConfirm: $('#reserver').hide(),
    cantBookMsg: $('#bookingImpossibleMsg'),
    form: $('form').hide(),
    mapCont: $('#map'),
    lat: 47.218371,
    lng: -1.553621,
    marker: null,
    stationCard: null,
    //6.3 Objec Methods
    //6.3.1 Initialize google map per se method
    initialize: function(params) {
        this.stationCard = params.stationCard;
        this.storage = params.storage;
        this.initMap();
    },
    //6.3.2 Google map method
    initMap: function() {
        var self = this;
        var nantes = {
            lat: self.lat,
            lng: self.lng
        };
        myMap = new google.maps.Map(document.getElementById('map'), {
            zoom: 11,
            center: nantes,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
        });
    },
    //6.3.3 Set Up Station Markers and manage click on marker behaviour method
    markersCreationsMarkersEvents: function(stations) {
        var markers = [];
        var self = this;
        console.log(stations);
        //6.3.4 Create station marker on map
        stations.forEach(function(station) {
            var iconBike = {
                url: 'medias/icon/' + iconBike + '.png',
                origin: new google.maps.Point(0, 0), // origin
                anchor: new google.maps.Point(0, 0), // anchor
            };
            //6.3.5 Depending on station' status and/or available bikes, set a different icon's color
            if ((station.status === 'CLOSED') || (station.available_bikes === 0)) {
                iconBike = 'red-bike';
            } else if ((station.status === 'OPEN') && (station.available_bikes > 5)) {
                iconBike = 'green-bike';
            } else if ((station.status === 'OPEN') && (station.available_bikes <= 2)) {
                iconBike = 'orange-bike';
            };
            var marker = new google.maps.Marker({
                position: station.position,
                map: myMap,
                icon: 'medias/icon/' + iconBike + '.png',
            });
            //6.3.6 Push markers for markes clustering see below section 2.8 "Set up markers clustering for a better user experience"
            markers.push(marker);
            //6.3.7 Set info widows when user click on a marker
            var contentString = station.name.substring(7) + ' , ' + station.available_bikes + ' vélo(s) disponible(s)';
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            //6.3.8 Click on marker to get their infos on right panel "Détails de la station"
            marker.addListener('click', function() {
                if (self.stationCard != null) {
                    self.stationCard.setStation(station);
                    self.stationCard.displayInfosStations();
                    self.storage.addStation(station);
                    self.form.show();
                    $(self.btnConfirm).show();
                    self.mapCont.css("max-width", "900px");
                }
                if ((station.status === 'CLOSED') || (station.available_bikes === 0)) {
                    $(self.btnConfirm).hide();
                    $(self.cantBookMsg).text("Réservation impossible pour cette station");
                    $(self.cantBookMsg).css({"color": "red","font-size": "0.9em"});
                } 
                else if (station.name === sessionStorage.stationBooked){
                    alert('Une réservation est déjà en cours à la station ' + sessionStorage.stationBooked.substring(7));
                    self.form.hide();
                    self.mapCont.css("max-width", "1350px");
                }
                else {
                    $(self.cantBookMsg).text('');
                    $(self.btnConfirm).show();
                }
                infowindow.open(map, marker);
            });
        });
        //6.3.9 Set up markers clustering for a better user experience
        var markerCluster = new MarkerClusterer(myMap, markers, {
            imagePath: 'medias/markerclusterer/m',
        });
    },
}
//7. Signature Canvas Feature
// 7.1. Object Canvas
var CanvasFeature = {
    //7.2 Object properties
    drawing: false,
    canvas: document.getElementById("myCanvas"),
    context: null,
    blankCanvas: $('#myCanvasBlank'),
    canvasContainer: $('#canvas_container').hide(),
    btnConfirm: $('#confirm'),
    btnEraseSignature: $('#erase_sign'),
    btnCancelSignature: $('#cancel_sign'),
    btnBook: $('#reserver'),
    //7.3 Object Methods
    //7.3.1 Initialize method
    initialize: function() {
        this.erase();
        this.cancelSignature();
        // 7.3.2 Calling Mouse events for PC and Mac
        this.canvas.addEventListener("touchstart", this.convertTouchEvent);
        this.canvas.addEventListener("touchmove", this.convertTouchEvent);
        this.canvas.addEventListener("touchend", this.convertTouchEvent);
        //7.3.3 Calling Touch Events for smartphones, tablets and other devices using a touchpad
        this.canvas.addEventListener("mousedown", this.startDraw.bind(CanvasFeature));
        this.canvas.addEventListener("mousemove", this.mouseMove.bind(CanvasFeature));
        this.canvas.addEventListener("mouseup", this.endDraw.bind(CanvasFeature));
    },
    //7.3.4 Show canvas drawing feature when button "Réserver" is clicked, see above for click trigger method
    showCanvas: function() {
        var x = $('#canvas_container');
        $(x).show();
    },
    //7.3.5 Converting mouse events to touch events method
    convertTouchEvent: function(ev) {
        var touch, ev_type, mouse_ev;
        touch = ev.targetTouches[0];
        ev.preventDefault();
        switch (ev.type) {
            case 'touchstart':
                // Make sure a finger is on touchpad
                if (ev.targetTouches.length != 1) {
                    return;
                }
                touch = ev.targetTouches[0];
                ev_type = 'mousedown';
                break;
            case 'touchmove':
                // Make sure a finger is on target aka canvas
                if (ev.targetTouches.length != 1) {
                    return;
                }
                touch = ev.targetTouches[0];
                ev_type = 'mousemove';
                break;
            case 'touchend':
                // Make sure finger is out of touchpad
                if (ev.changedTouches.length != 1) {
                    return;
                }
                touch = ev.changedTouches[0];
                ev_type = 'mouseup';
                break;
            default:
                return;
        }
        //Creating mouse events
        mouse_ev = document.createEvent("MouseEvents");
        mouse_ev.initMouseEvent(
            ev_type,
            true,
            true,
            //Event view
            window,
            //Click Counter
            0,
            // X screen's info
            touch.screenX,
            // Y screen's info
            touch.screenY,
            // X client's info 
            touch.clientX,
            // Y client's info
            touch.clientY,
            //First mouse button
            0,
            //Target value
            null
        );
        this.dispatchEvent(mouse_ev);
    },
    //7.3.6 Get mouse position method
    getMousePos: function(event) {
        // Return element size and its position relative to window
        rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    },
    //7.3.7 Handle mouse moves method
    mouseMove: function(event) {
        mousePosition = this.getMousePos(event);
        positionX = mousePosition.x;
        positionY = mousePosition.y;
        this.draw(positionX, positionY);
    },
    //7.3.8 Drawing method
    draw: function(positionX, positionY) {
        this.context = this.canvas.getContext("2d");
        this.context.lineWidth = 5;
        if (this.drawing) {
            this.context.lineTo(positionX, positionY);
            this.context.stroke();
        }
    },
    //7.3.9 Stop drawing method
    endDraw: function() {
        this.drawing = false;
    },
    //7.3.10 Start drawing method
    startDraw: function() {
        this.drawing = true;
        this.context.beginPath();
        this.context.moveTo(positionX, positionY);
    },
    //7.3.11 Erase signature method
    erase: function() {
        var self = this;
        $(this.btnEraseSignature).click(function() {
            self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
        });
    },
    //7.3.12 Cancel signature : cancel signature step and hide canvas drawing feature
    cancelSignature: function() {
        var self = this;
        $(this.btnCancelSignature).click(function() {
            $(self.canvasContainer).hide();
            $(self.btnBook).show();
        });
    }
}
//8. Footer section sum up booking and display countdown (lasting for 20min)
//8.1 Bookingsection Object
var BookingSection = {
    //8.2 Object properties
    storage: null,
    stationName: null,
    userLname: $('#last_name'),
    userFname: $('#first_name'),
    canvasContainer: $('#canvas_container'),
    bookingInfoZone: $('#your_booking_msg_zone'),
    bookingMsg: $('.booking_msg'),
    countdownMsg: $('.countdown_msg'),
    btnConfirm: $('#confirm'),
    btnCancel: $('#cancel_booking').hide(),
    form: $('form'),
    cancel: false,
    countDownInterval : null,
    mapCont : $('#map'),
    //8.3 Object methods
    //8.3.1 Initialize method
    initialize: function(params) {
        this.storage = params.storage;
        this.canvas = params.canvas;
        this.getBookedStation();
        this.btnConfirmEvents();
        this.btnCancelEvents();
        this.displayStationName();
        this.countDown();
    },
    //8.3.2 Get station name method
    getStationName: function() {
        var station = this.storage.getStation();
        if (station) {
            this.stationName = station.name;
        }
    },
    //8.3.3 Save station name which is finally booked method
    validateStation: function(){
        this.getStationName();
        this.storage.addStationBooked(this.stationName);
    },
    //8.3.4 Get booked station's name method
    getBookedStation : function(){
        var station = this.storage.getStationBooked();
        console.log(station);
        if (station) {
            this.stationName = station;
        }
    },
    //8.3.5 Display station name method
    displayStationName: function(stationName) {
        this.getBookedStation();
        if (this.stationName != null) {
            $(this.bookingMsg).text("Réservation en cours pour la station " + this.stationName.substring(7) + " valable ");
            $(this.bookingInfoZone).css({"background-color": "green","color": "white","font-size": "1em","text-align": "center"});
            $(this.btnCancel.show())
        }
    },
    //8.3.6 Events triggered by clicking on "Confirm button" method
    btnConfirmEvents: function() {
        var self = this;
        $(this.btnConfirm).click(function() {
            if (myBookingSection.canvas.canvas.toDataURL() == document.getElementById('myCanvasBlank').toDataURL()) {
                alert("Veuillez signer pour confirmer votre réservation");
            } else {
                alert("Votre réservation est bien prise en compte " + JSON.parse(localStorage.getItem('userDatas')));
                clearInterval(self.countDownInterval);
                $(self.canvasContainer).hide();
                $(self.form).hide();
                $(self.btnCancel).show();
                $(self.mapCont).css("max-width", "1400px");
                self.setTimer();
                self.validateStation();
                self.displayStationName();
            }
        });
    },
    //8.3.7 Events triggered by clicking on "Cancel button" method
    btnCancelEvents: function() {
        var self = this;
        $(this.btnCancel).click(function() {
            self.cancel = true;
            clearInterval(self.countDownInterval);
            sessionStorage.clear();
            $(self.bookingMsg).text('Votre réservation est annulée');
            $(self.countdownMsg).text('');
            $(self.bookingInfoZone).css({"background-color": "orange","color": "white","font-size": "1em","text-align": "center"});
            $(self.btnCancel).hide();
            $(self.form).hide();
            $(self.mapCont).css("max-width", "1400px");
        });
    },
    //8.3.8 Set countdown start method
    setTimer: function() {
        var timer = new Date().getTime() + 1200000;
        sessionStorage.setItem('start', timer);
        this.countDown();
    },
    //8.3.9 Countdown method
    countDown: function(station) {
        var self = this;
        if (sessionStorage.getItem('start') === null) {
            return false;
        }
        this.countDownInterval = setInterval(function() {
            var now = new Date().getTime();
            var timeRun = sessionStorage.getItem('start') - now;
            var minutes = Math.floor((timeRun % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((timeRun % (1000 * 60)) / 1000);
            $(self.countdownMsg).text(minutes + " minutes " + seconds + " secondes");
            if (timeRun < 0 && self.cancel === false) {
                clearInterval(self.countDownInterval);
                sessionStorage.clear();
                // If the countdown is over, display a message which warns user
                $(self.bookingMsg).text('Votre réservation a expirée');
                $(self.countdownMsg).text('');
                $(self.bookingInfoZone).css({"background-color": "red","color": "white","font-size": "1em","text-align": "center"});
                $(self.btnCancel).hide();
            }
        }, 500);
    }
}
//9. Instance app's objects
//9.1 Instance Session and Local Storage object
var myStorage = Object.create(Storage);
myStorage.initialize();
//9.2 Instance show/hide slider object
var help = Object.create(DisplayHelp);
help.initialize();
//9.3 Instance slider object
var diaporama = Object.create(Diapo);
diaporama.initialize();
//9.4 Instance canvas object
var myCanvasFeature = Object.create(CanvasFeature);
myCanvasFeature.initialize();
//9.5 Instance station card object
var myStationCard = Object.create(StationCard);
myStationCard.initialize({
    storage: myStorage,
    canvas: myCanvasFeature
});
//9.6 Instance map object
var mapNantes = Object.create(MyMap);
mapNantes.initialize({
    stationCard: myStationCard,
    storage: myStorage
});
//9.7 Instance map's markers object
var getDataApiNantes = Object.create(GetDataApi);
getDataApiNantes.initialize(
    function(stations) {
        mapNantes.markersCreationsMarkersEvents(stations)
    }
);
getDataApiNantes.storage = myStorage;
//9.8 Instance booking section object
var myBookingSection = Object.create(BookingSection);
myBookingSection.initialize({
    storage: myStorage,
    canvas: myCanvasFeature
});