$(document).ready(function() {

    $('#mnuProfile').on('click', function() {
        alert("Display user profile");
        return false;
    });

    $('#mnuHeart').on('click', function() {
        alert("Display things you like");
        return false;
    });

    $('#mnuCompass').on('click', function() {
        alert("Display suggestions");
        return false;
    });

    $('#imageUploadForm').on('submit',(function(e) {
        e.preventDefault()
        $.ajax({
            type:'POST',
            url: $(this).attr('action'),
            data:$(this).serialize(),
            cache:false,
            success: function(data) {
                alert(data);
            },
            error: function(jqXhr, status, err) {
                alert("ERROR: " + err);
            }
        });
    }));

});