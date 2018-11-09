// make a socket connection
        var socket
        window.onload = function () {
               socket = io('http://localhost:3000');
               socket.on('chat message', function (msg) {
                    msgObj = JSON.parse(msg)
                    console.log(msgObj)
                    msgObj.toggle = "left"
                    let time = 0
                    if (msgObj.name == "MACHINE"){
                        msgObj.toggle = "right"
                        time=1500
                    }
                    if (msgObj.isResponse) {
                        let pct = (msgObj.score * 100).toFixed(1) + "%"
                        msgObj.Body = `I am ${pct} confident that you want to ${msgObj.action}`
                        time = 2000
                    }
                    
                    insertChat(msgObj, time);
              })
            };          

        function formatAMPM(date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
        }

        //--handle chat messages
        function insertChat(obj, time) {
           
            var control = "";
            var date = formatAMPM(new Date());

            if (obj.toggle == 'left') {
                control = '<li style="width:100%">' +
                    '<div class="msj macro">' +
                    '<div class="avatar"><img class="img-circle" style="width:100%;" src="' + obj.image + '" /></div>' +
                    '<div class="text text-l">' +
                    '<p><small> Context is ' + obj.Channel + '</small></p>' +
                    '<p>' + obj.Body + '</p>' +
                    '<p><small>' + date + '</small></p>' +
                    '</div>' +
                    '</div>' +
                    '</li>';
            } else {
                control = '<li style="width:100%;">' +
                    '<div class="msj-rta macro">' +
                    '<div class="text text-r">' +
                    '<p>' + obj.Body + '</p>' +
                    '<p><small>' + date + '</small></p>' +
                    '</div>' +
                    '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="' + obj.image + '" /></div>' +
                    '</li>';
            }
            
            setTimeout(
                function () {
                    $("ul").append(control).scrollTop($("ul").prop('scrollHeight'));
                }, time);
            

        }

        function resetChat() {
            $("ul").empty();
        }         

        $(".mytext").on("keydown", function (e) {           
            if (e.which == 13) {
                var text = $(this).val();
                if (text !== "") {
                    insertChat("me", text);
                    $(this).val('');
                    socket.emit('chat message', text);
                }
            }           
        });

        $('body > div > div > div:nth-child(2) > span').click(function () {
            $(".mytext").trigger({ type: 'keydown', which: 13, keyCode: 13 });
        })

        //-- Clear Chat
        resetChat();

            //-- Print Messages
            /*
            insertChat("me", "Hello Tom...", 0);
            insertChat("you", "Hi, Pablo", 1500);
            insertChat("me", "What would you like to talk about today?", 3500);
            insertChat("you", "Tell me a joke", 7000);
            insertChat("me", "Spaceman: Computer! Computer! Do we bring battery?!", 9500);
            insertChat("you", "LOL", 12000);
            */
        