/*/*window.addEventListener('load', () => {*/
    //Server
    let idKeyAdmin
    var myStream;
    var currentPeer;
    var isScreenShare = false;
    var idKeyClient
    //peer.on('open', function (id) {
    //    idkey=id
    //})
    //peer.on('call', function (call) {
    //    navigator.mediaDevices.getUserMedia({
    //        video: true,
    //        audio: true
    //    }).then((stream) => {
    //        myStream = stream
    //        call.answer(stream)
    //        call.on('stream', function (remoteStream) {
    //            addRemoteVideo(remoteStream)
    //        })
    //    }).catch((err) => {
    //        console.log('err')
    //    })
    //})

    //function callPeer(id) {
    //    navigator.mediaDevices.getUserMedia({
    //        video: true,
    //        audio: true
    //    }).then((stream) => {
    //        myStream = stream
    //        let call = peer.call(id, stream)
    //        call.on('stream', function (remoteStream) {
    //            addRemoteVideo(remoteStream)
    //        })
    //    }).catch((err) => {
    //        console.log('err')
    //    })
    //}

    //function addRemoteVideo(stream) {
    //    let video = document.getElementById("localStream")
    //    video.srcObject = stream
    //    video.play()
    //}
    function openStream() {
        const config = { audio: false, video: true };
        return navigator.mediaDevices.getUserMedia(config)

    }

    function playStream(idVideoTag, stream) {
        const video = document.getElementById(idVideoTag)
        video.srcObject = stream;
        video.play();
    }
const peer = new Peer()
const peerServer = new Peer()
peer.on('open', id => { idKeyAdmin = id })
    //$('#call-peer').click(function () {
    //    const id = idKeyAdmin
    //    var second = 0
    //    var minute = 0
    //    setInterval(function () {
    //        second++
    //        if (second > 59) {
    //            minute++
    //            second = 0
    //        }
    //        $('.call-duration').text((minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second))
    //    }, 1000)

    //    //openStream().then(stream => {
    //    //    playStream('localStream', stream)
    //    //    const call = peer.call(id, stream)
    //    //    call.on('stream', remoteStream => playStream('remoteStream', remoteStream))
    //    //})
    //    peer.on('call', call => {
    //        openStream().then(stream => {
    //            call.answer(stream)
    //            playStream('localStream', stream)

    //            call.on('stream', remoteStream => {
    //                playStream('remoteStream', remoteStream)
    //                currentPeer = call.peerConnection
    //            })
    //        })
    //    })
    //})

    $('.share-screen').click(function () {
        navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio:
            {
                echoCancellation: true,
                noiseSuppression: true
            }
        }).then((stream) => {
            stream.onended = () => { // Click on browser UI stop sharing button
                stopScreenShare()
            };
            playStream('localStream', stream)
            openStream().then(stream => {
                playStream('localStream', stream)
                const call = peer.call(idKeyAdmin, stream)
                call.on('stream', remoteStream => playStream('remoteStream', remoteStream))
            })
        }).catch((err) => {
            console.log('err')
        })
    })

    function stopScreenShare() {
        navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then((stream) => {
            playStream('localStream', stream)
            const call = peer.call(id, stream)
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream))
        }).catch((err) => {
            console.log('err')
        })
    }

$('.btn-makecall').click(function (e) {
    
    openStream().then(stream => {
        playStream('localStream', stream)
        const call = peer.call(idKeyAdmin, stream)
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream))
    })
    openStream().then(stream => {
        playStream('remoteStream', stream)
        const call = peer.call(idKeyAdmin, stream)
        call.on('stream', localStream => playStream('localStream', localStream))
    })
})
    //client

/*})*/