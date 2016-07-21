/*
 *
 * mads - version 2.00.01
 * Copyright (c) 2015, Ninjoe
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * https://en.wikipedia.org/wiki/MIT_License
 * https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
 *
 */
var mads = function() {
    /* Get Tracker */
    if (typeof custTracker == 'undefined' && typeof rma != 'undefined') {
        this.custTracker = rma.customize.custTracker;
    } else if (typeof custTracker != 'undefined') {
        this.custTracker = custTracker;
    } else {
        this.custTracker = [];
    }

    /* CT */
    if (typeof ct == 'undefined' && typeof rma != 'undefined') {
        this.ct = rma.ct;
    } else if (typeof ct != 'undefined') {
        this.ct = ct;
    } else {
        this.ct = [];
    }

    /* CTE */
    if (typeof cte == 'undefined' && typeof rma != 'undefined') {
        this.cte = rma.cte;
    } else if (typeof cte != 'undefined') {
        this.cte = cte;
    } else {
        this.cte = [];
    }

    /* tags */
    if (typeof tags == 'undefined' && typeof tags != 'undefined') {
        this.tags = this.tagsProcess(rma.tags);
    } else if (typeof tags != 'undefined') {
        this.tags = this.tagsProcess(tags);
    } else {
        this.tags = '';
    }

    /* Unique ID on each initialise */
    this.id = this.uniqId();

    /* Tracked tracker */
    this.tracked = [];
    /* each engagement type should be track for only once and also the first tracker only */
    this.trackedEngagementType = [];
    /* trackers which should not have engagement type */
    this.engagementTypeExlude = [];
    /* first engagement */
    this.firstEngagementTracked = false;

    /* Body Tag */
    this.bodyTag = document.getElementsByTagName('body')[0];

    /* Head Tag */
    this.headTag = document.getElementsByTagName('head')[0];

    /* RMA Widget - Content Area */
    this.contentTag = document.getElementById('rma-widget');

    /* URL Path */
    this.path = typeof rma != 'undefined' ? rma.customize.src : '';

    /* Solve {2} issues */
    for (var i = 0; i < this.custTracker.length; i++) {
        if (this.custTracker[i].indexOf('{2}') != -1) {
            this.custTracker[i] = this.custTracker[i].replace('{2}', '{{type}}');
        }
    }
};

/* Generate unique ID */
mads.prototype.uniqId = function() {

    return new Date().getTime();
}

mads.prototype.tagsProcess = function(tags) {

    var tagsStr = '';

    for (var obj in tags) {
        if (tags.hasOwnProperty(obj)) {
            tagsStr += '&' + obj + '=' + tags[obj];
        }
    }

    return tagsStr;
}

/* Link Opner */
mads.prototype.linkOpener = function(url) {

    if (typeof url != "undefined" && url != "") {

        if (typeof mraid !== 'undefined') {
            mraid.open(url);
        } else {
            window.open(url);
        }
    }
}

/* tracker */
mads.prototype.tracker = function(tt, type, name, value) {

    /*
     * name is used to make sure that particular tracker is tracked for only once
     * there might have the same type in different location, so it will need the name to differentiate them
     */
    name = name || type;

    if (typeof this.custTracker != 'undefined' && this.custTracker != '' && this.tracked.indexOf(name) == -1) {
        for (var i = 0; i < this.custTracker.length; i++) {

            if (name === 'participate' && i !== 2) continue;

            if (name !== 'participate' && i === 2) continue;

            var img = document.createElement('img');

            if (typeof value == 'undefined') {
                value = '';
            }

            /* Insert Macro */
            var src = this.custTracker[i].replace('{{rmatype}}', type);
            src = src.replace('{{rmavalue}}', value);

            /* Insert TT's macro */
            // if (this.trackedEngagementType.indexOf(tt) != '-1' || this.engagementTypeExlude.indexOf(tt) != '-1') {
            //     src = src.replace('tt={{rmatt}}', '');
            // } else {
                src = src.replace('{{rmatt}}', tt);
                this.trackedEngagementType.push(tt);
            // }

            /* Append ty for first tracker only */
            if (!this.firstEngagementTracked && tt == 'E') {
                src = src + '&ty=E';
                this.firstEngagementTracked = true;
            }

            /* */
            img.src = src + this.tags + '&' + this.id;

            img.style.display = 'none';
            this.bodyTag.appendChild(img);

            this.tracked.push(name);
        }
    }
};

/* Load JS File */
mads.prototype.loadJs = function(js, callback) {
    var script = document.createElement('script');
    script.src = js;

    if (typeof callback != 'undefined') {
        script.onload = callback;
    }

    this.headTag.appendChild(script);
}

/* Load CSS File */
mads.prototype.loadCss = function(href) {
    var link = document.createElement('link');
    link.href = href;
    link.setAttribute('type', 'text/css');
    link.setAttribute('rel', 'stylesheet');

    this.headTag.appendChild(link);
}

var renderAd = function() {
  var sent = false;
    var app = new mads();

    var qa = [{
        'Q': 'Are you voting in the upcoming primary?',
        'A': ['Very Likely', 'Somewhat Likely', 'Unlikely', 'Unsure'],
        'T': 'upcomingprimary_ver1'
    }, {
        'Q': 'Who is your first choice for President?',
        'A': ['Cruz', 'Kasich', 'Trump', 'Undecided'],
        'T': 'firstchoice_ver1'
    }, {
        'Q': 'Who is your 2nd choice?',
        'A': ['Cruz', 'Kasich', 'Trump', 'Undecided'],
        'T': 'secondchoice_ver1'
    }, {
        'Q': 'What are your key issues?',
        'A': ['National Security and Fighting Islamic Terrorism', 'Peace Through Strength Foreign Policy', 'Reducing Government Spending', 'Economic Stability and Security', 'Appointing Judges Who Respect the Constitution'],
        'T': 'keyissues_ver1',
        'Long': true
    }, {
        'Q': 'How will you vote?',
        'A': ['Vote Absentee/By Mail', 'Vote Early', 'Vote Election Day', 'Unsure'],
        'T': 'howyouvote_ver1'
    }, {
        'Q': 'What is your opinion of Cruz?',
        'A': ['Extremely Favorable', 'Somewhat Favorable', 'Neutral', 'Somewhat Unfavorable', 'Extremely Unfavorable'],
        'T': 'opinionofcruz_ver1'
    }, {
        'Q': 'What is your opinion of Kasich?',
        'A': ['Extremely Favorable', 'Somewhat Favorable', 'Neutral', 'Somewhat Unfavorable', 'Extremely Unfavorable'],
        'T': 'opinionofkasich_ver1'
    }, {
        'Q': 'What is your opinion of Trump?',
        'A': ['Extremely Favorable', 'Somewhat Favorable', 'Neutral', 'Somewhat Unfavorable', 'Extremely Unfavorable'],
        'End': true,
        'T': 'opinionoftrump_ver1'
    }]

    var current = 0,
        pageq = [],
        results = [],
        content = 'How do you feel<br />about 2016?<br /><br />Support your candidate!';

    app.contentTag.innerHTML = '<div id="main" class="abs"><div id="ad-content" class="abs"><div id="front">' + content + '<br /><br /><div id="participate">PARTICIPATE NOW</div></div></div><div id="disclaimer" class="abs">Disclaimer: This survey is paid for by Trusted Leadership PAC</div></div>';

    var main = document.getElementById('main'),
        content = document.getElementById('ad-content'),
        front = document.getElementById('front'),
        disclaimer = document.getElementById('disclaimer');

    var end = document.createElement('div');
    end.className = 'thankyou hide abs';
    end.innerText = 'THANK YOU';

    var pager = document.createElement('div');
    pager.className = 'pager abs';
    pager.innerText = '1/' + qa.length;
    content.appendChild(pager);

    var arrows = document.createElement('div');
    arrows.className = 'arrows hide abs';
    arrows.innerHTML = '<img class="left" src="' + app.path + 'img/larrow.png"><img class="right" src="' + app.path + 'img/rarrow.png">'
    content.appendChild(arrows);

    var left = document.querySelector('.left');
    var right = document.querySelector('.right');
    left.addEventListener('click', function() {

        if (this.style.opacity < 1) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        pageq[current].className = 'questionaire hide' + (qa[current].Long ? ' long' : '') + (qa[current].End ? ' end' : '');
        current -= 1;
        pageq[current].className = 'questionaire' + (qa[current].Long ? ' long' : '') + (qa[current].End ? ' end' : '');
        setTimeout(function() {
            pageq[current].style.opacity = 1;
        }, 1)

        if (typeof results[current - 1] !== 'undefined') {
            arrows.childNodes[0].style.opacity = 1;
        } else {
            arrows.childNodes[0].style.opacity = 0;
        }

        if (typeof results[current] !== 'undefined') {
            arrows.childNodes[1].style.opacity = 1;
        } else {
            arrows.childNodes[1].style.opacity = 0;
        }

        for (var c in pageq[current].childNodes) {
            var s = pageq[current].childNodes[c]
            if (typeof s.className !== 'undefined') {
                s.className = s.className.replace('selected', '');
            }
        }

        if (typeof results[current] !== 'undefined') {
            var s = pageq[current].childNodes[qa[current].A.indexOf(results[current].A) + 1];
            s.className = s.className + ' selected';
        }

        pager.innerText = (current + 1) + '/' + qa.length;
    }, false);

    right.addEventListener('click', function() {

        if (this.style.opacity < 1) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        pageq[current].className = 'questionaire hide' + (qa[current].Long ? ' long' : '') + (qa[current].End ? ' end' : '');
        current += 1;
        pageq[current].className = 'questionaire' + (qa[current].Long ? ' long' : '') + (qa[current].End ? ' end' : '');
        setTimeout(function() {
            pageq[current].style.opacity = 1;
        }, 1)

        if (typeof results[current - 1] !== 'undefined') {
            arrows.childNodes[0].style.opacity = 1;
        } else {
            arrows.childNodes[0].style.opacity = 0;
        }

        if (typeof results[current] !== 'undefined') {
            arrows.childNodes[1].style.opacity = 1;
        } else {
            arrows.childNodes[1].style.opacity = 0;
        }

        for (var c in pageq[current].childNodes) {
            var s = pageq[current].childNodes[c]
            if (typeof s.className !== 'undefined') {
                s.className = s.className.replace('selected', '');
            }
        }

        if (typeof results[current] !== 'undefined') {
            var s = pageq[current].childNodes[qa[current].A.indexOf(results[current].A) + 1];
            s.className = s.className + ' selected';
        }


        pager.innerText = (current + 1) + '/' + qa.length;
    }, false);

    var getURLParameter = function(name, custom) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec((typeof custom !== 'undefined' ? custom : location.search)) || [, ""])[1].replace(/\+/g, '%20')) || null;
    }

    var sendResult = function(r) {
        var req = new XMLHttpRequest();
        var url = '//www.cdn.serving1.net/poll';
        var q = '';



        if (r.length !== qa.length) {
            for (var i = r.length; i < qa.length; i++) {
                r.push({
                    'Q': qa[i].Q,
                    'A': 'skipped',
                    'T': qa[i].T
                })
            }
        }

        for (var i in r) {
            //'q' + (parseInt(i) + 1) + '='
            q += r[i].T + '=' + r[i].A + '&';
        }
        q = q.slice(0, -1).replace(/\?/g, '');

        if (typeof app.custTracker[0] !== 'undefined') {
            var campaignId = getURLParameter('campaignId', app.custTracker[0]);
            var rmaId = getURLParameter('rmaId', app.custTracker[0]);
            var userId = getURLParameter('userId', app.custTracker[0]);
            var cb = getURLParameter('id', app.custTracker[1]);
            var q = 'campaignId=' + campaignId + '&rmaId=' + rmaId + '&userId=' + userId +  '&cb=' + cb + '&' + q;
        }

        if (!sent) {
          req.open("POST", url + '?' + q, true);

          req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

          req.onreadystatechange = function() {
              if (req.readyState == 4 && req.status == 200) {
                  console.log(req.responseText);
              }
          }
          req.send(q);
          sent = true;
        }


        console.log(q);
    }

    for (var i in qa) {
        var q = document.createElement('div');
        q.className = 'questionaire hide' + (qa[i].Long ? ' long' : '') + (qa[i].End ? ' end' : '');
        q.setAttribute('data-index', i);
        q.setAttribute('data-tracker_type', qa[i].T);
        q.innerHTML = '<div class="question q' + i + '">' + qa[i].Q + '</div>';

        for (var a in qa[i].A) {
            var answer = document.createElement('div');
            answer.className = 'answer q' + i + ' a' + a
            answer.innerText = qa[i].A[a]
            q.appendChild(answer);

            answer.onclick = function(e) {
                if (e.target.className.indexOf('selected') > -1) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }

                if (results.map(function(e) {
                        return e.Q
                    }).indexOf(this.parentElement.childNodes[0].innerText) === -1) {
                    results.push({
                        'Q': this.parentElement.childNodes[0].innerText,
                        'A': e.target.innerText,
                        'T': this.parentElement.getAttribute('data-tracker_type')
                    })
                } else {
                    results[this.parentElement.getAttribute('data-index')] = {
                        'Q': this.parentElement.childNodes[0].innerText,
                        'A': e.target.innerText,
                        'T': this.parentElement.getAttribute('data-tracker_type')
                    }
                }

                if (typeof results[current] !== 'undefined') {
                    arrows.childNodes[0].style.opacity = 1;
                } else {
                    arrows.childNodes[0].style.opacity = 0;
                }

                if (typeof results[current + 1] !== 'undefined') {
                    arrows.childNodes[1].style.opacity = 1;
                } else {
                    arrows.childNodes[1].style.opacity = 0;
                }

                this.parentElement.className = 'questionaire hide' + (qa[current].Long ? ' long' : '') + (qa[current].End ? ' end' : '');
                current = (current != pageq.length - 1) ? current + 1 : 'end';
                if (current !== 'end') {
                    pageq[current].className = 'questionaire' + (qa[current].Long ? ' long' : '') + (qa[current].End ? ' end' : '');
                    setTimeout(function() {
                        pageq[current].style.opacity = 1;
                    }, 1)
                    pager.innerText = (current + 1) + '/' + qa.length;
                    app.tracker('E', this.parentElement.getAttribute('data-tracker_type'));
                } else {
                    pager.innerText = ''
                    arrows.childNodes[1].style.opacity = 0;
                    arrows.childNodes[0].style.opacity = 0;
                    end.className = 'thankyou abs';

                    app.tracker('E', this.parentElement.getAttribute('data-tracker_type'));

                    setTimeout(function() {
                        sendResult(results);
                    }, 100)
                }


            };
        }

        pageq.push(q);
        content.appendChild(q);

        if (qa[i].End) {
            var last = document.createElement('div');
            last.className = 'answer last';
            last.innerText = 'Last Question'
            q.appendChild(last);
            content.appendChild(end);
        }
    }

    main.style.background = 'url(' + app.path + 'img/bg.jpg' + ')';
    front.style.zIndex = 99;

    var onceMain = true;

    main.addEventListener('click', function() {
        if (onceMain) {
            front.style.display = 'none';
            disclaimer.style.opacity = '1';
            pageq[0].className = 'questionaire';
            arrows.className = 'arrows abs';
            arrows.childNodes[0].style.opacity = 0;
            arrows.childNodes[1].style.opacity = 0;
            setTimeout(function() {
                pageq[0].style.opacity = 1;
                arrows.style.opacity = 1;
            }, 1)
            onceMain = false;
            app.tracker('E', 'participate');
        }
    }, false);

    var receiveMessage = function(e) {
        if (typeof e.data.auth !== 'undefined' && e.data.auth.type === 'closeExpandable') {
            sendResult(results);
        }
    }
    window.addEventListener("message", receiveMessage, false);

    app.loadCss(app.path + 'css/style.css');
};

var ad = renderAd();
