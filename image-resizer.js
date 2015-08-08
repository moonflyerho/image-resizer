/*
 * A small library that provides capabilities to resize large images by using an HTML canvas resize then convert trick
 */

IR = IR || {};
IR.ImageResizer = (function() {

    /*
     * Uses a canvas to shrink/scale an image
     */
    var resize = function(image, maxWidth, maxHeight) {
        // setup the canvas
        var canvas = document.createElement('canvas');
        canvas.height = image.height;
        canvas.width = image.width;

        // set the correct accepted dimensions on the canvas
        if (image.width > image.height) {
            if (image.width > maxWidth) {
                canvas.height = image.height * maxWidth / image.width;	        // maintain aspect ratio
                canvas.width = maxWidth;
            }
        } else {
            if (image.height > maxHeight) {
                canvas.width = image.width * maxHeight / image.height;
                canvas.height = maxHeight;
            }
        }

        // draw the image
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);

        return canvas.toDataURL();
    };
    
    var thumb = function(image, maxWidth, maxHeight) {

        var cwidth = 0;
        var cheight = 0;
        // set the correct accepted dimensions on the canvas
        if (image.width > image.height) {
            if (image.width > maxWidth) {
                cheight = image.height * maxWidth / image.width;	        // maintain aspect ratio
                cwidth = maxWidth;
            }
        } else {
            if (image.height > maxHeight) {
                cwidth = image.width * maxHeight / image.height;
                cheight = maxHeight;
            }
        }
        
        // Step it down several times
        var can2 = document.createElement('canvas');
        can2.width = cwidth*8;
        can2.height = cheight*8;
        var ctx2 = can2.getContext('2d');
        
        // Draw it at 1/2 size 3 times (step down three times)
        
        ctx2.drawImage(img, 0, 0, cwidth*4, cheight*4);
        ctx2.drawImage(can2, 0, 0, cwidth*4, cheight*4, 0, 0, cwidth*2, cheight*2);
        ctx2.drawImage(can2, 0, 0, cwidth*2, cheight*2, 0, 0, cwidth, cheight);
        
        
        var can = document.getElementById('canvas1');
        can.width = cwidth;
        can.height = cheight;        
        var ctx = can.getContext('2d');
        ctx.drawImage(can2, 0, 0, cwidth, cheight, 0, 0, cwidth, cheight);        

        return can.toDataURL();
    };

    /*
     * Converts a data URI object to a Blob object
     */
    var toBlob = function(dataURI) {
        var parts = dataURI.split(',');
        var mimeType = parts[0].substr(5, parts[0].substr(5).length - 7 );		// yields: 'image/png'
        var data = atob(parts[1]);											    // yields the base64 encoded data described by the mime above

        var buffer = [];
        for (var i = 0; i < data.length; i++) {
            buffer.push(data.charCodeAt(i));
        }

        return new Blob([buffer], {type: mimeType});
    }

    // control scope using return, only expose the members returned below
    return {
        resize: resize,
        toBlob: toBlob
    };

})();
