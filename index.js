$(document).ready(function () {
    var simpleProductsList = [];
    var detailedProductsList = [];

    loadAllProducts();

    $('.icon').click(function (evt) {
        searchForItems($('#search').val());
    });

    var getDetailedProductsList = function (plist) {
        var dfd = $.Deferred();

        var promises = plist.map(getSingleProductFromServer);

        $.when.apply($, promises).then(function (data) {
            dfd.resolve();
        });

        return dfd.promise();
    };

    var getSingleProductFromServer = function (p) {
        var dfd = $.Deferred();
        $.ajax({
            url: "http://api.flim-flamming.com/items/" + p.itemCode + "?key=pfB5qzSDzmvxc2A16e05"
        })
        .done(function (data) {
            detailedProductsList.push(data);
            dfd.resolve(data);
        })
        .fail(function () { console.log(p.itemCode + ' failed'); dfd.resolve(); });
        return dfd.promise();
    };

    function loadAllProducts() {
        $.ajax({
            url: "http://api.flim-flamming.com/items?key=pfB5qzSDzmvxc2A16e05"
        })
        .done(function (data) {
            simpleProductsList = data.products;
            $.when(getDetailedProductsList(simpleProductsList))
            .done(function (data) {
                createDisplay();
            });
        });
    }

    function createDisplay() {
        detailedProductsList.forEach(function (p) {
            var mainSection = document.getElementById('itemsDisplay');
            //parent div for product
            var prodDiv = document.createElement('div');
            prodDiv.className = 'prodDiv';
            prodDiv.id = p.itemCode;
            //prod image
            var prodImg = document.createElement('img');
            prodImg.src = 'http://api.flim-flamming.com/assets/images/' + p.itemCode + '.jpg';
            prodImg.className = 'prodImg';
            prodDiv.appendChild(prodImg);
            //prod name
            var prodName = document.createElement('div');
            prodName.className = 'prodName';
            var prodNameText = document.createTextNode(p.productName);
            prodName.appendChild(prodNameText);
            prodDiv.appendChild(prodName);
            //prod id
            var prodID = document.createElement('div');
            prodID.className = 'prodID';
            var prodIDText = document.createTextNode('#' + p.itemCode);
            prodID.appendChild(prodIDText);
            prodDiv.appendChild(prodID);
            //prod description
            var prodDesc = document.createElement('div');
            prodDesc.className = 'prodDesc';
            var prodDescText = document.createTextNode(p.description);
            prodDesc.appendChild(prodDescText);
            prodDiv.appendChild(prodDesc);
            //prod price
            var prodPrice = document.createElement('div');
            var prodPriceNum = document.createElement('span');
            prodPriceNum.className = 'prodPriceNum';
            var prodPriceNumText = document.createTextNode('$' + p.price);
            prodPriceNum.appendChild(prodPriceNumText);
            var prodPriceSoldBy = document.createElement('span');
            prodPriceSoldBy.className = 'prodPriceSoldBy';
            var prodPriceSoldByText = document.createTextNode(' per ' + p.soldBy);
            prodPriceSoldBy.appendChild(prodPriceSoldByText);
            prodPrice.appendChild(prodPriceNum);
            prodPrice.appendChild(prodPriceSoldBy);
            prodDiv.appendChild(prodPrice);
            //add to display
            mainSection.appendChild(prodDiv);
        });
    }

    function searchForItems(criteria) {
        //find products that match search criteria
        detailedProductsList.forEach(function (p) {
            var isFound = false;
            for (var prop in p) {
                if (p.hasOwnProperty(prop)) {
                    var searchStr = p[prop].toString().toLowerCase();
                    if (searchStr.search(criteria.toLowerCase()) !== -1) {
                        isFound = true;
                    }
                }
            }
            if (isFound) {
                $('#' + p.itemCode).show();
            }
            else {
                $('#' + p.itemCode).hide();
            }
        });
    }
});
