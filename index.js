$(() => {
    let allData = []
    $(".about-me").hide()
    $.ajax({

        url: `https://api.coingecko.com/api/v3/coins/list`,
        success: data => {

            $("#cards").show()
            $("#my-spinner").hide()

            allData = data
            card(data)

        }
    })

    const card = (data) => {
        let cards = $("#cards")
        let card = ''
        let input = $("#input-search").val()
        input = ''
        cards.empty()
        for (let i = 0; i < 100; i++) {
            card += `<div id="${i}" class="card my-cars" style="width: 18rem;">
                    <div class="card-body">
                        <div id="t">
                            <div>
                                <h5 class="card-title">${data[i].symbol}</h5>
                            </div>
                            <div  class="custom-control custom-switch">
                                <input  type="checkbox" class="custom-control-input" id="cardCustomSwitches-${data[i].id}">
                                <label class="custom-control-label" for="cardCustomSwitches-${data[i].id}"></label>
                            </div>
                        </div>   
                        <hr>
                        <p class="card-text"> ${data[i].name}</p>
                        <button id="${data[i].id}" type="button" class="btn btn-outline-info ">more infro</button>
                        <div id="${data[i].id}Data">
                        </div>



                    </div>
                </div>`

        }
        $("#cards").append(card)
        $(".spinner-container").hide()
        moreInfoFunction()
    }

    //     <div class="spinner-container" id="spinner${data[i].id}-container">
    //     <div id="loading-spinner" class="d-flex justify-content-center">
    //         <div class="spinner-border" role="status">
    //             <span class="sr-only">Loading...</span>
    //         </div>
    //     </div>
    // </div>
    $("#crypto-button").click(function () {
        $("#cards").show();
        // $("#my-spinner").hide();

    });



    const moreInfoFunction = () => {

        $(".btn-outline-info").click(function () {

            $(this).next().collapse('toggle')
            if ($(this).next().children().length <= 0) {
                console.log("sara")
                let cardId = $(this).attr("id")
                console.log(cardId)
                // $(`#spinner${cardId}-container`).show()

                $.ajax({
                    url: `https://api.coingecko.com/api/v3/coins/${cardId}`,
                    success: function (data) {
                        saveMoreInfoToLocalStorage(data)
                    }
                });


                saveMoreInfoToLocalStorage = (data) => {
                    console.log(data)
                    let moreInfoObject = {
                        usd: `${data.market_data.current_price.usd}`,
                        eur: `${data.market_data.current_price.eur}`,
                        ils: `${data.market_data.current_price.ils}`,
                        imgSrc: `${data.image.small}`,
                        symbol: `${data.symbol}`
                    }
                    localStorage.setItem(`moreInfoObject${data.symbol}`, JSON.stringify(moreInfoObject))
                    setTimeout(() => {
                        localStorage.removeItem(`moreInfoObject${data.symbol}`)
                    }, 120000);

                    appendDataContainer(data)
                }

                const appendDataContainer = (data) => {
                    let moreInfoStringFromLocalStorage = localStorage.getItem(`moreInfoObject${data.symbol}`)
                    let moreInfoObjectFromLocalStorage = JSON.parse(moreInfoStringFromLocalStorage)
                    console.log("data")

                    let moreInfo = `
                            <div class="more-data-container">
                                    <p class="card-text">${moreInfoObjectFromLocalStorage.usd}$</p>
                                    <p class="card-text">${moreInfoObjectFromLocalStorage.eur}€</p>
                                    <p class="card-text">${moreInfoObjectFromLocalStorage.ils}₪</p>
                                    <img src="${moreInfoObjectFromLocalStorage.imgSrc}" alt="${moreInfoObjectFromLocalStorage.symbol} img">
                                </div>
                            `
                    $(this).next().append(moreInfo)


                }
            } else {
                console.log("d")
                return
            }

        })
    }









    //פנק חיפוש 

    $("#button-search").click(function (e) {
        e.preventDefault()

        let inputId = $("#input-search").val()
        let filterByIdCrypto = allData.filter(data => data.id.includes(inputId))
        card(filterByIdCrypto)
    })



    let arrToggle = []
    let objCrypto
    $('body').on('click', '.custom-control-input', (e) => {

        let t = e.currentTarget
        console.log(t)

        if (t.checked) {

            objCrypto = allData.find(data => data.id === t.id.slice(19))

            arrToggle.push(objCrypto)
            console.log(arrToggle)
            if (arrToggle.length === 6) {
                modalCrypto()
            }
        }
        else {
            objCrypto = allData.find(data => data.id === t.id.slice(19))



            arrToggle.splice(
                $.inArray(objCrypto, arrToggle), 1
            )

            console.log(arrToggle)
            console.log("here")

            // arrToggle=[...arrToggle.filter((element)=>{element.id!==objCrypto})  ]
        }

    })
    const modalCrypto = () => {

        let switchToggle = ""

        $("#modal-body").empty()
        for (let i = 0; i < arrToggle.length - 1; i++) {
            switchToggle +=
                `<div id="t">
                    <div>
                        <h5 class="card-title">${arrToggle[i].symbol}</h5>
                    </div>
                    <div  class="custom-control custom-switch">
                        <input  type="checkbox" checked class="custom-control-input" id="customSwitches-${arrToggle[i].id}">
                        <label class="custom-control-label" for="customSwitches-${arrToggle[i].id}"></label>
                    </div>
                </div> `
        }
        $("#modal-body").append(switchToggle)
        $("#modal-id").modal("show")
    }
    $('#modal-id').on('click', '.custom-control-input', (e) => {
        let t = e.currentTarget
        const idElement = t.id.slice(15)
        const idRemove = arrToggle.find(data => { data.id === idElement })
        arrToggle.splice(
            $.inArray(idRemove, arrToggle), 1
        )

        console.log($(`#cardCustomSwitches-${idElement}`)[0].checked)

        $(`#cardCustomSwitches-${idElement}`)[0].checked = false;
        $("#modal-id").modal("hide")

    })



    $('.button-close').click((e) => {
        console.log('lastObj')

        e.preventDefault()
        let lastObj = arrToggle.pop()
        console.log(lastObj)
        $(`#cardCustomSwitches-${lastObj.id}`)[0].checked = false;


    })

    $('#real-time-button').click((e) => {

        e.preventDefault()

        $(".card").hide()
        $(".about-me").show()
    })

    $('#crypto-button').click((e) => {

        e.preventDefault()

        $(".card").show()
        $(".about-me").hide()
    })








})

    //     var parameters = $(this).closest('form').serialize();

    //     alert(parameters);

    //     //ajax call here

    // });

    // const s = (data) => {
    //     for (let i = 0; i < 100; i++) {
    //         // console.log(data[i].symbol)
    //         console.log(data[i].name)
    //         console.log(data[i].id)

    //     }
    // }

