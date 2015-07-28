    ! function(a) {
        "use strict";

        function b(b, c) {
            return function() {
                if (void 0 !== b) {
                    var d = Array.prototype.slice.call(arguments),
                        e = (new Date).toUTCString();
                    a.console.logs.push([c, e].concat(d));
                    try {
                        b.apply(a.console, d)
                    } catch (f) {
                        Function.prototype.apply.call(b, a.console, d)
                    }
                }
            }
        }
        if ("undefined" != typeof console) {
            var c, d = {
                error: a.console.error,
                warn: a.console.warn,
                info: a.console.info,
                debug: a.console.debug,
                log: a.console.log
            };
            a.console.logs = [];
            for (c in d) d.hasOwnProperty(c) && (a.console[c] = b(d[c], c))
        }
    }(this),
    function(a) {
        "use strict";

        function b() {
            var a = navigator.userAgent.toLowerCase();
            return -1 != a.indexOf("msie") ? parseInt(a.split("msie")[1]) : !1
        }

        function c(a) {
            if (b() && b() <= 9) return void f("MSIE 9 and lower is not supported. Please install a newer browser!");
            var c = a.bridge.url,
                d = a.bridge.configUrl,
                g = window.trezor.http(d),
                h = a.extensionId;
            e(c, h).then(function(a) {
                return g.then(function(b) {
                    return a.configure(b)
                }).then(function() {
                    f(null, a)
                })
            }).catch(function(a) {
                f(a)
            })
        }

        function d() {
            var b = a.injector(["webwalletApp"]);
            return b.get("config")
        }

        function e(a, b) {
            function c() {
                return console.log("[app] Attempting to load http transport"), f.HttpTransport.connect(a).then(function(b) {
                    return console.log("[app] Loading http transport successful", b), new f.HttpTransport(a)
                }, function(a) {
                    throw console.warn("[app] Loading http transport failed", a), a
                })
            }

            function d() {
                return f.ChromeExtensionTransport.create(b)
            }

            function e() {
                return console.log("[app] Attempting to load plugin transport"), f.PluginTransport.loadPlugin().then(function(a) {
                    return new f.PluginTransport(a)
                })
            }
            var f = window.trezor;
            return d().catch(c).catch(e)
        }

        function f(b, c) {
            var d = a.module("webwalletApp"),
                e = document.getElementById("webwalletApp-container");
            b ? console.error(b) : d.config(g), d.value("trezorError", b).value("trezorApi", window.trezor).value("trezor", c);
            try {
                a.bootstrap(e, ["webwalletApp"])
            } catch (f) {
                console.error("[app] Error occured while bootstrapping the Angular.js app."), console.error(f), e.innerHTML = ['<div class="page-container container">', '  <div class="row" ng-if="installed">', '    <div class="col-md-6 col-md-offset-3">', '      <div class="alert alert-danger">', "        <h4>Plugin loading failed :(</h4>", "        <textarea>", b || "", f, "        </textarea>", "      </div>", "    </div>", "  </div>", "</div>"].join(""), e.removeAttribute("ng-cloak")
            }
        }

        function g(a) {
            a.when("/", {
                templateUrl: "views/main.html"
            }).when("/import", {
                templateUrl: "views/import.html"
            }).when("/device/:deviceId", {
                templateUrl: "views/device/index.html"
            }).when("/device/:deviceId/load", {
                templateUrl: "views/device/load.html"
            }).when("/device/:deviceId/dangerzone", {
                templateUrl: "views/device/dangerzone.html"
            }).when("/device/:deviceId/advanced", {
                templateUrl: "views/device/advanced.html"
            }).when("/device/:deviceId/settings", {
                templateUrl: "views/device/settings.html"
            }).when("/device/:deviceId/recovery", {
                templateUrl: "views/device/recovery.html"
            }).when("/device/:deviceId/wipe", {
                templateUrl: "views/device/wipe.html"
            }).when("/device/:deviceId/account/:accountId", {
                templateUrl: "views/account/index.html"
            }).when("/device/:deviceId/account/:accountId/send", {
                templateUrl: "views/account/send/main.html"
            }).when("/device/:deviceId/account/:accountId/send/:output", {
                templateUrl: "views/account/send/main.html"
            }).when("/device/:deviceId/account/:accountId/send/:output/amount/:amount", {
                templateUrl: "views/account/send/main.html"
            }).when("/device/:deviceId/account/:accountId/receive", {
                templateUrl: "views/account/receive.html"
            }).when("/device/:deviceId/account/:accountId/sign", {
                templateUrl: "views/account/sign.html"
            }).when("/send/:uri*", {
                resolve: {
                    uriRedirect: "uriRedirect"
                }
            }).otherwise({
                redirectTo: "/"
            })
        }

        function h() {
            var a, b = "bitcoin",
                c = "/#/send/%s",
                d = "MyTrezor: Send Bitcoins to address";
            a = location.protocol + "//" + location.host + c, !navigator.registerProtocolHandler || navigator.isProtocolHandlerRegistered && navigator.isProtocolHandlerRegistered(b, a) || navigator.registerProtocolHandler(b, a, d)
        }
        console.log("[app] User agent : ", window.navigator.userAgent), a.module("webwalletApp", ["ngRoute", "ngSanitize", "ui.bootstrap", "ja.qr"]), a.element(document).ready(function() {
            c(d()), h()
        }), g.$inject = ["$routeProvider"]
    }(this.angular), angular.module("webwalletApp").constant("config", {
        debug: !1,
        features: {
            addressVerification: "1.3.0",
            getFeatures: "1.3.3",
            cacheInFeatures: "1.3.3"
        },
        bridge: {
            url: "https://localback.net:21324",
            configUrl: "https://mytrezor.s3.amazonaws.com/plugin/config_signed.bin",
            pluginMinVersion: "1.0.5"
        },
        extensionId: "jcjjhjgimijdkoamemaghajlhegmoclj",
        deprecatePlugin: !1,
        storageVersion: "1.1.0",
        feePerKb: 1e4,
        coin: "Bitcoin",
        backends: {
            Bitcoin: {
                sendWithInsight: !0,
                sendWithBop: !0,
                insightEndpoint: ["https://chain.localbitcoins.com", "https://insight.bitpay.com"],
                bcInfoEndpoint: "https://blockchain.info",
                endpoint: "https://mytrezor.com",
                after: "2014-01-01",
                lookAhead: 40,
                firstIndex: 0
            },
            Testnet: {
                sendWithInsight: !1,
                sendWithBop: !0,
                insightEndpoint: "https://test-insight.bitpay.com",
                endpoint: "https://test.mytrezor.com",
                after: "2014-01-01",
                lookAhead: 40,
                firstIndex: 0
            }
        },
        versions: {
            Bitcoin: 76067358,
            Testnet: 76067358
        },
        scriptTypes: {
            Bitcoin: {
                5: "PAYTOSCRIPTHASH"
            },
            Testnet: {
                196: "PAYTOSCRIPTHASH"
            }
        },
        indices: {
            Bitcoin: 0,
            Testnet: 1
        },
        blockExplorers: {
            Bitcoin: {
                urlTx: "https://blockchain.info/tx/",
                urlAddress: "https://blockchain.info/address/",
                name: "Blockchain"
            },
            Testnet: {
                urlTx: "https://tbtc.blockr.io/tx/info/",
                urlAddress: "https://tbtc.blockr.io/address/info/",
                name: "Blockr"
            }
        },
        useBip44: !0
    }), angular.module("webwalletApp").filter("password", function() {
        "use strict";
        return function(a) {
            return a.replace(/./g, "â±")
        }
    }), angular.module("webwalletApp").value("bip39", {
        english: ["abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse", "access", "accident", "account", "accuse", "achieve", "acid", "acoustic", "acquire", "across", "act", "action", "actor", "actress", "actual", "adapt", "add", "addict", "address", "adjust", "admit", "adult", "advance", "advice", "aerobic", "affair", "afford", "afraid", "again", "age", "agent", "agree", "ahead", "aim", "air", "airport", "aisle", "alarm", "album", "alcohol", "alert", "alien", "all", "alley", "allow", "almost", "alone", "alpha", "already", "also", "alter", "always", "amateur", "amazing", "among", "amount", "amused", "analyst", "anchor", "ancient", "anger", "angle", "angry", "animal", "ankle", "announce", "annual", "another", "answer", "antenna", "antique", "anxiety", "any", "apart", "apology", "appear", "apple", "approve", "april", "arch", "arctic", "area", "arena", "argue", "arm", "armed", "armor", "army", "around", "arrange", "arrest", "arrive", "arrow", "art", "artefact", "artist", "artwork", "ask", "aspect", "assault", "asset", "assist", "assume", "asthma", "athlete", "atom", "attack", "attend", "attitude", "attract", "auction", "audit", "august", "aunt", "author", "auto", "autumn", "average", "avocado", "avoid", "awake", "aware", "away", "awesome", "awful", "awkward", "axis", "baby", "bachelor", "bacon", "badge", "bag", "balance", "balcony", "ball", "bamboo", "banana", "banner", "bar", "barely", "bargain", "barrel", "base", "basic", "basket", "battle", "beach", "bean", "beauty", "because", "become", "beef", "before", "begin", "behave", "behind", "believe", "below", "belt", "bench", "benefit", "best", "betray", "better", "between", "beyond", "bicycle", "bid", "bike", "bind", "biology", "bird", "birth", "bitter", "black", "blade", "blame", "blanket", "blast", "bleak", "bless", "blind", "blood", "blossom", "blouse", "blue", "blur", "blush", "board", "boat", "body", "boil", "bomb", "bone", "bonus", "book", "boost", "border", "boring", "borrow", "boss", "bottom", "bounce", "box", "boy", "bracket", "brain", "brand", "brass", "brave", "bread", "breeze", "brick", "bridge", "brief", "bright", "bring", "brisk", "broccoli", "broken", "bronze", "broom", "brother", "brown", "brush", "bubble", "buddy", "budget", "buffalo", "build", "bulb", "bulk", "bullet", "bundle", "bunker", "burden", "burger", "burst", "bus", "business", "busy", "butter", "buyer", "buzz", "cabbage", "cabin", "cable", "cactus", "cage", "cake", "call", "calm", "camera", "camp", "can", "canal", "cancel", "candy", "cannon", "canoe", "canvas", "canyon", "capable", "capital", "captain", "car", "carbon", "card", "cargo", "carpet", "carry", "cart", "case", "cash", "casino", "castle", "casual", "cat", "catalog", "catch", "category", "cattle", "caught", "cause", "caution", "cave", "ceiling", "celery", "cement", "census", "century", "cereal", "certain", "chair", "chalk", "champion", "change", "chaos", "chapter", "charge", "chase", "chat", "cheap", "check", "cheese", "chef", "cherry", "chest", "chicken", "chief", "child", "chimney", "choice", "choose", "chronic", "chuckle", "chunk", "churn", "cigar", "cinnamon", "circle", "citizen", "city", "civil", "claim", "clap", "clarify", "claw", "clay", "clean", "clerk", "clever", "click", "client", "cliff", "climb", "clinic", "clip", "clock", "clog", "close", "cloth", "cloud", "clown", "club", "clump", "cluster", "clutch", "coach", "coast", "coconut", "code", "coffee", "coil", "coin", "collect", "color", "column", "combine", "come", "comfort", "comic", "common", "company", "concert", "conduct", "confirm", "congress", "connect", "consider", "control", "convince", "cook", "cool", "copper", "copy", "coral", "core", "corn", "correct", "cost", "cotton", "couch", "country", "couple", "course", "cousin", "cover", "coyote", "crack", "cradle", "craft", "cram", "crane", "crash", "crater", "crawl", "crazy", "cream", "credit", "creek", "crew", "cricket", "crime", "crisp", "critic", "crop", "cross", "crouch", "crowd", "crucial", "cruel", "cruise", "crumble", "crunch", "crush", "cry", "crystal", "cube", "culture", "cup", "cupboard", "curious", "current", "curtain", "curve", "cushion", "custom", "cute", "cycle", "dad", "damage", "damp", "dance", "danger", "daring", "dash", "daughter", "dawn", "day", "deal", "debate", "debris", "decade", "december", "decide", "decline", "decorate", "decrease", "deer", "defense", "define", "defy", "degree", "delay", "deliver", "demand", "demise", "denial", "dentist", "deny", "depart", "depend", "deposit", "depth", "deputy", "derive", "describe", "desert", "design", "desk", "despair", "destroy", "detail", "detect", "develop", "device", "devote", "diagram", "dial", "diamond", "diary", "dice", "diesel", "diet", "differ", "digital", "dignity", "dilemma", "dinner", "dinosaur", "direct", "dirt", "disagree", "discover", "disease", "dish", "dismiss", "disorder", "display", "distance", "divert", "divide", "divorce", "dizzy", "doctor", "document", "dog", "doll", "dolphin", "domain", "donate", "donkey", "donor", "door", "dose", "double", "dove", "draft", "dragon", "drama", "drastic", "draw", "dream", "dress", "drift", "drill", "drink", "drip", "drive", "drop", "drum", "dry", "duck", "dumb", "dune", "during", "dust", "dutch", "duty", "dwarf", "dynamic", "eager", "eagle", "early", "earn", "earth", "easily", "east", "easy", "echo", "ecology", "economy", "edge", "edit", "educate", "effort", "egg", "eight", "either", "elbow", "elder", "electric", "elegant", "element", "elephant", "elevator", "elite", "else", "embark", "embody", "embrace", "emerge", "emotion", "employ", "empower", "empty", "enable", "enact", "end", "endless", "endorse", "enemy", "energy", "enforce", "engage", "engine", "enhance", "enjoy", "enlist", "enough", "enrich", "enroll", "ensure", "enter", "entire", "entry", "envelope", "episode", "equal", "equip", "era", "erase", "erode", "erosion", "error", "erupt", "escape", "essay", "essence", "estate", "eternal", "ethics", "evidence", "evil", "evoke", "evolve", "exact", "example", "excess", "exchange", "excite", "exclude", "excuse", "execute", "exercise", "exhaust", "exhibit", "exile", "exist", "exit", "exotic", "expand", "expect", "expire", "explain", "expose", "express", "extend", "extra", "eye", "eyebrow", "fabric", "face", "faculty", "fade", "faint", "faith", "fall", "false", "fame", "family", "famous", "fan", "fancy", "fantasy", "farm", "fashion", "fat", "fatal", "father", "fatigue", "fault", "favorite", "feature", "february", "federal", "fee", "feed", "feel", "female", "fence", "festival", "fetch", "fever", "few", "fiber", "fiction", "field", "figure", "file", "film", "filter", "final", "find", "fine", "finger", "finish", "fire", "firm", "first", "fiscal", "fish", "fit", "fitness", "fix", "flag", "flame", "flash", "flat", "flavor", "flee", "flight", "flip", "float", "flock", "floor", "flower", "fluid", "flush", "fly", "foam", "focus", "fog", "foil", "fold", "follow", "food", "foot", "force", "forest", "forget", "fork", "fortune", "forum", "forward", "fossil", "foster", "found", "fox", "fragile", "frame", "frequent", "fresh", "friend", "fringe", "frog", "front", "frost", "frown", "frozen", "fruit", "fuel", "fun", "funny", "furnace", "fury", "future", "gadget", "gain", "galaxy", "gallery", "game", "gap", "garage", "garbage", "garden", "garlic", "garment", "gas", "gasp", "gate", "gather", "gauge", "gaze", "general", "genius", "genre", "gentle", "genuine", "gesture", "ghost", "giant", "gift", "giggle", "ginger", "giraffe", "girl", "give", "glad", "glance", "glare", "glass", "glide", "glimpse", "globe", "gloom", "glory", "glove", "glow", "glue", "goat", "goddess", "gold", "good", "goose", "gorilla", "gospel", "gossip", "govern", "gown", "grab", "grace", "grain", "grant", "grape", "grass", "gravity", "great", "green", "grid", "grief", "grit", "grocery", "group", "grow", "grunt", "guard", "guess", "guide", "guilt", "guitar", "gun", "gym", "habit", "hair", "half", "hammer", "hamster", "hand", "happy", "harbor", "hard", "harsh", "harvest", "hat", "have", "hawk", "hazard", "head", "health", "heart", "heavy", "hedgehog", "height", "hello", "helmet", "help", "hen", "hero", "hidden", "high", "hill", "hint", "hip", "hire", "history", "hobby", "hockey", "hold", "hole", "holiday", "hollow", "home", "honey", "hood", "hope", "horn", "horror", "horse", "hospital", "host", "hotel", "hour", "hover", "hub", "huge", "human", "humble", "humor", "hundred", "hungry", "hunt", "hurdle", "hurry", "hurt", "husband", "hybrid", "ice", "icon", "idea", "identify", "idle", "ignore", "ill", "illegal", "illness", "image", "imitate", "immense", "immune", "impact", "impose", "improve", "impulse", "inch", "include", "income", "increase", "index", "indicate", "indoor", "industry", "infant", "inflict", "inform", "inhale", "inherit", "initial", "inject", "injury", "inmate", "inner", "innocent", "input", "inquiry", "insane", "insect", "inside", "inspire", "install", "intact", "interest", "into", "invest", "invite", "involve", "iron", "island", "isolate", "issue", "item", "ivory", "jacket", "jaguar", "jar", "jazz", "jealous", "jeans", "jelly", "jewel", "job", "join", "joke", "journey", "joy", "judge", "juice", "jump", "jungle", "junior", "junk", "just", "kangaroo", "keen", "keep", "ketchup", "key", "kick", "kid", "kidney", "kind", "kingdom", "kiss", "kit", "kitchen", "kite", "kitten", "kiwi", "knee", "knife", "knock", "know", "lab", "label", "labor", "ladder", "lady", "lake", "lamp", "language", "laptop", "large", "later", "latin", "laugh", "laundry", "lava", "law", "lawn", "lawsuit", "layer", "lazy", "leader", "leaf", "learn", "leave", "lecture", "left", "leg", "legal", "legend", "leisure", "lemon", "lend", "length", "lens", "leopard", "lesson", "letter", "level", "liar", "liberty", "library", "license", "life", "lift", "light", "like", "limb", "limit", "link", "lion", "liquid", "list", "little", "live", "lizard", "load", "loan", "lobster", "local", "lock", "logic", "lonely", "long", "loop", "lottery", "loud", "lounge", "love", "loyal", "lucky", "luggage", "lumber", "lunar", "lunch", "luxury", "lyrics", "machine", "mad", "magic", "magnet", "maid", "mail", "main", "major", "make", "mammal", "man", "manage", "mandate", "mango", "mansion", "manual", "maple", "marble", "march", "margin", "marine", "market", "marriage", "mask", "mass", "master", "match", "material", "math", "matrix", "matter", "maximum", "maze", "meadow", "mean", "measure", "meat", "mechanic", "medal", "media", "melody", "melt", "member", "memory", "mention", "menu", "mercy", "merge", "merit", "merry", "mesh", "message", "metal", "method", "middle", "midnight", "milk", "million", "mimic", "mind", "minimum", "minor", "minute", "miracle", "mirror", "misery", "miss", "mistake", "mix", "mixed", "mixture", "mobile", "model", "modify", "mom", "moment", "monitor", "monkey", "monster", "month", "moon", "moral", "more", "morning", "mosquito", "mother", "motion", "motor", "mountain", "mouse", "move", "movie", "much", "muffin", "mule", "multiply", "muscle", "museum", "mushroom", "music", "must", "mutual", "myself", "mystery", "myth", "naive", "name", "napkin", "narrow", "nasty", "nation", "nature", "near", "neck", "need", "negative", "neglect", "neither", "nephew", "nerve", "nest", "net", "network", "neutral", "never", "news", "next", "nice", "night", "noble", "noise", "nominee", "noodle", "normal", "north", "nose", "notable", "note", "nothing", "notice", "novel", "now", "nuclear", "number", "nurse", "nut", "oak", "obey", "object", "oblige", "obscure", "observe", "obtain", "obvious", "occur", "ocean", "october", "odor", "off", "offer", "office", "often", "oil", "okay", "old", "olive", "olympic", "omit", "once", "one", "onion", "online", "only", "open", "opera", "opinion", "oppose", "option", "orange", "orbit", "orchard", "order", "ordinary", "organ", "orient", "original", "orphan", "ostrich", "other", "outdoor", "outer", "output", "outside", "oval", "oven", "over", "own", "owner", "oxygen", "oyster", "ozone", "pact", "paddle", "page", "pair", "palace", "palm", "panda", "panel", "panic", "panther", "paper", "parade", "parent", "park", "parrot", "party", "pass", "patch", "path", "patient", "patrol", "pattern", "pause", "pave", "payment", "peace", "peanut", "pear", "peasant", "pelican", "pen", "penalty", "pencil", "people", "pepper", "perfect", "permit", "person", "pet", "phone", "photo", "phrase", "physical", "piano", "picnic", "picture", "piece", "pig", "pigeon", "pill", "pilot", "pink", "pioneer", "pipe", "pistol", "pitch", "pizza", "place", "planet", "plastic", "plate", "play", "please", "pledge", "pluck", "plug", "plunge", "poem", "poet", "point", "polar", "pole", "police", "pond", "pony", "pool", "popular", "portion", "position", "possible", "post", "potato", "pottery", "poverty", "powder", "power", "practice", "praise", "predict", "prefer", "prepare", "present", "pretty", "prevent", "price", "pride", "primary", "print", "priority", "prison", "private", "prize", "problem", "process", "produce", "profit", "program", "project", "promote", "proof", "property", "prosper", "protect", "proud", "provide", "public", "pudding", "pull", "pulp", "pulse", "pumpkin", "punch", "pupil", "puppy", "purchase", "purity", "purpose", "purse", "push", "put", "puzzle", "pyramid", "quality", "quantum", "quarter", "question", "quick", "quit", "quiz", "quote", "rabbit", "raccoon", "race", "rack", "radar", "radio", "rail", "rain", "raise", "rally", "ramp", "ranch", "random", "range", "rapid", "rare", "rate", "rather", "raven", "raw", "razor", "ready", "real", "reason", "rebel", "rebuild", "recall", "receive", "recipe", "record", "recycle", "reduce", "reflect", "reform", "refuse", "region", "regret", "regular", "reject", "relax", "release", "relief", "rely", "remain", "remember", "remind", "remove", "render", "renew", "rent", "reopen", "repair", "repeat", "replace", "report", "require", "rescue", "resemble", "resist", "resource", "response", "result", "retire", "retreat", "return", "reunion", "reveal", "review", "reward", "rhythm", "rib", "ribbon", "rice", "rich", "ride", "ridge", "rifle", "right", "rigid", "ring", "riot", "ripple", "risk", "ritual", "rival", "river", "road", "roast", "robot", "robust", "rocket", "romance", "roof", "rookie", "room", "rose", "rotate", "rough", "round", "route", "royal", "rubber", "rude", "rug", "rule", "run", "runway", "rural", "sad", "saddle", "sadness", "safe", "sail", "salad", "salmon", "salon", "salt", "salute", "same", "sample", "sand", "satisfy", "satoshi", "sauce", "sausage", "save", "say", "scale", "scan", "scare", "scatter", "scene", "scheme", "school", "science", "scissors", "scorpion", "scout", "scrap", "screen", "script", "scrub", "sea", "search", "season", "seat", "second", "secret", "section", "security", "seed", "seek", "segment", "select", "sell", "seminar", "senior", "sense", "sentence", "series", "service", "session", "settle", "setup", "seven", "shadow", "shaft", "shallow", "share", "shed", "shell", "sheriff", "shield", "shift", "shine", "ship", "shiver", "shock", "shoe", "shoot", "shop", "short", "shoulder", "shove", "shrimp", "shrug", "shuffle", "shy", "sibling", "sick", "side", "siege", "sight", "sign", "silent", "silk", "silly", "silver", "similar", "simple", "since", "sing", "siren", "sister", "situate", "six", "size", "skate", "sketch", "ski", "skill", "skin", "skirt", "skull", "slab", "slam", "sleep", "slender", "slice", "slide", "slight", "slim", "slogan", "slot", "slow", "slush", "small", "smart", "smile", "smoke", "smooth", "snack", "snake", "snap", "sniff", "snow", "soap", "soccer", "social", "sock", "soda", "soft", "solar", "soldier", "solid", "solution", "solve", "someone", "song", "soon", "sorry", "sort", "soul", "sound", "soup", "source", "south", "space", "spare", "spatial", "spawn", "speak", "special", "speed", "spell", "spend", "sphere", "spice", "spider", "spike", "spin", "spirit", "split", "spoil", "sponsor", "spoon", "sport", "spot", "spray", "spread", "spring", "spy", "square", "squeeze", "squirrel", "stable", "stadium", "staff", "stage", "stairs", "stamp", "stand", "start", "state", "stay", "steak", "steel", "stem", "step", "stereo", "stick", "still", "sting", "stock", "stomach", "stone", "stool", "story", "stove", "strategy", "street", "strike", "strong", "struggle", "student", "stuff", "stumble", "style", "subject", "submit", "subway", "success", "such", "sudden", "suffer", "sugar", "suggest", "suit", "summer", "sun", "sunny", "sunset", "super", "supply", "supreme", "sure", "surface", "surge", "surprise", "surround", "survey", "suspect", "sustain", "swallow", "swamp", "swap", "swarm", "swear", "sweet", "swift", "swim", "swing", "switch", "sword", "symbol", "symptom", "syrup", "system", "table", "tackle", "tag", "tail", "talent", "talk", "tank", "tape", "target", "task", "taste", "tattoo", "taxi", "teach", "team", "tell", "ten", "tenant", "tennis", "tent", "term", "test", "text", "thank", "that", "theme", "then", "theory", "there", "they", "thing", "this", "thought", "three", "thrive", "throw", "thumb", "thunder", "ticket", "tide", "tiger", "tilt", "timber", "time", "tiny", "tip", "tired", "tissue", "title", "toast", "tobacco", "today", "toddler", "toe", "together", "toilet", "token", "tomato", "tomorrow", "tone", "tongue", "tonight", "tool", "tooth", "top", "topic", "topple", "torch", "tornado", "tortoise", "toss", "total", "tourist", "toward", "tower", "town", "toy", "track", "trade", "traffic", "tragic", "train", "transfer", "trap", "trash", "travel", "tray", "treat", "tree", "trend", "trial", "tribe", "trick", "trigger", "trim", "trip", "trophy", "trouble", "truck", "true", "truly", "trumpet", "trust", "truth", "try", "tube", "tuition", "tumble", "tuna", "tunnel", "turkey", "turn", "turtle", "twelve", "twenty", "twice", "twin", "twist", "two", "type", "typical", "ugly", "umbrella", "unable", "unaware", "uncle", "uncover", "under", "undo", "unfair", "unfold", "unhappy", "uniform", "unique", "unit", "universe", "unknown", "unlock", "until", "unusual", "unveil", "update", "upgrade", "uphold", "upon", "upper", "upset", "urban", "urge", "usage", "use", "used", "useful", "useless", "usual", "utility", "vacant", "vacuum", "vague", "valid", "valley", "valve", "van", "vanish", "vapor", "various", "vast", "vault", "vehicle", "velvet", "vendor", "venture", "venue", "verb", "verify", "version", "very", "vessel", "veteran", "viable", "vibrant", "vicious", "victory", "video", "view", "village", "vintage", "violin", "virtual", "virus", "visa", "visit", "visual", "vital", "vivid", "vocal", "voice", "void", "volcano", "volume", "vote", "voyage", "wage", "wagon", "wait", "walk", "wall", "walnut", "want", "warfare", "warm", "warrior", "wash", "wasp", "waste", "water", "wave", "way", "wealth", "weapon", "wear", "weasel", "weather", "web", "wedding", "weekend", "weird", "welcome", "west", "wet", "whale", "what", "wheat", "wheel", "when", "where", "whip", "whisper", "wide", "width", "wife", "wild", "will", "win", "window", "wine", "wing", "wink", "winner", "winter", "wire", "wisdom", "wise", "wish", "witness", "wolf", "woman", "wonder", "wood", "wool", "word", "work", "world", "worry", "worth", "wrap", "wreck", "wrestle", "wrist", "write", "wrong", "yard", "year", "yellow", "you", "young", "youth", "zebra", "zero", "zone", "zoo"]
    }), angular.module("webwalletApp").value("_", window._).value("Buffer", window.vendor.Buffer).value("ecurve", window.vendor.ecurve).value("bitcoin", window.vendor.bitcoin).value("base58check", window.vendor.bs58check), angular.module("webwalletApp").factory("selecter", function() {
        return {
            selectRange: function(a) {
                var b, c, d = window.document,
                    e = d.body;
                return e.createTextRange ? (c = e.createTextRange(), c.moveToElementText(a), void c.select()) : window.getSelection ? (b = window.getSelection(), c = d.createRange(), c.selectNodeContents(a), b.removeAllRanges(), void b.addRange(c)) : void 0
            }
        }
    }), angular.module("webwalletApp").directive("debug", function() {
        return {
            restrict: "E",
            transclude: !0,
            template: '<div class="debug" ng-if="debug" ng-transclude></div>',
            controller: ["config", "$scope", function(a, b) {
                b.debug = a.debug
            }]
        }
    }), angular.module("webwalletApp").filter("amount", ["utils", function(a) {
        var b = 2,
            c = 8;
        return function(d, e) {
            var f = a.amount2str(d),
                g = f.indexOf(".");
            0 > g && (f += ".", g = f.length - 1);
            var h = f.length - g - 1;
            b > h && (f += new Array(b - h + 1).join("0"), h = b);
            var i = c - h;
            return i > 0 && (f += new Array(i + 1).join(" ")), e && f >= 0 && (f = "+" + f), f
        }
    }]), angular.module("webwalletApp").filter("ordinal", function() {
        return function(a) {
            var b = "th";
            switch (+a % 10) {
                case 1:
                    b = "st";
                    break;
                case 2:
                    b = "nd";
                    break;
                case 3:
                    b = "rd"
            }
            switch (+a % 100) {
                case 11:
                case 12:
                case 13:
                    b = "th"
            }
            return "" + a + b
        }
    }), angular.module("webwalletApp").filter("bip32Path", function() {
        return function(a) {
            return "m/" + a.map(function(a) {
                return 2147483648 & a ? (2147483647 & a) + "'" : a
            }).join("/")
        }
    }), angular.module("webwalletApp").service("utils", ["config", "trezor", "trezorApi", "ecurve", "bitcoin", "base58check", "Buffer", "_", "$q", "$log", "$http", "$interval", "$timeout", "$location", "$rootScope", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
        function p(a) {
            return new g(a, "binary")
        }

        function q(a) {
            return new g(a).toString("binary")
        }

        function r(a) {
            return new g(a, "base64")
        }

        function s(a) {
            return new g(a).toString("base64")
        }

        function t(a) {
            return new g(a, "hex")
        }

        function u(a) {
            return new g(a).toString("hex")
        }

        function v(a) {
            var b = unescape(encodeURIComponent(a));
            return u(p(b))
        }

        function w(a) {
            var b = q(t(a));
            return decodeURIComponent(escape(b))
        }

        function x(a) {
            return (a / 1e8).toString()
        }

        function y(a) {
            var b = a.split(".");
            if (2 === b.length) {
                var c = b[1];
                if (c.length > 8) throw new TypeError("Amount has too many decimals")
            }
            var d = +a,
                e = Math.round(1e8 * d);
            if (isNaN(e)) throw new TypeError("Amount is not a number");
            return e
        }

        function z(a) {
            return e.crypto.hash256(a)
        }

        function A(a, b) {
            var c, d = i.defer(),
                e = d.promise,
                f = !1;
            return e.cancel = function() {
                f = !0
            }, c = h.throttle(function() {
                k(a).then(function(a) {
                    f || (d.notify(a), c())
                }).catch(d.reject)
            }, b), c(), e
        }

        function B(a) {
            var b = f.decode(a),
                c = u(b),
                d = {};
            if ("00" !== c.substring(90, 92)) throw new Error("Contains invalid private key");
            return d.depth = parseInt(c.substring(8, 10), 16), d.fingerprint = parseInt(c.substring(10, 18), 16), d.child_num = parseInt(c.substring(18, 26), 16), d.chain_code = c.substring(26, 90), d.private_key = c.substring(92, 156), d
        }

        function C(a) {
            var b = f.decode(a),
                c = u(b),
                d = {};
            return d.depth = parseInt(c.substring(8, 10), 16), d.fingerprint = parseInt(c.substring(10, 18), 16), d.child_num = parseInt(c.substring(18, 26), 16), d.chain_code = c.substring(26, 90), d.public_key = c.substring(90, 156), d
        }

        function D(a, b) {
            function c(a, b) {
                for (var c = parseInt(a).toString(16); c.length < b;) c = "0" + c;
                return c
            }
            var d, e, g;
            return d = c(b, 8) + c(a.depth, 2) + c(a.fingerprint, 8) + c(a.child_num, 8) + a.chain_code + a.public_key, e = t(d), g = f.encode(e)
        }

        function E(a, b) {
            var c = a.public_key,
                d = t(c),
                f = e.crypto.hash160(d);
            return F(f, b)
        }

        function F(a, b) {
            var c, d = new g(1);
            return d[0] = +b, c = g.concat([d, a]), f.encode(c)
        }

        function G(a) {
            var b, c;
            return b = f.decode(a), c = b.slice(0, 21), {
                version: b[0],
                hash: b.slice(1)
            }
        }

        function H(a, d) {
            var e, f;
            if (e = J(a, d), I(e), b instanceof c.PluginTransport && (f = b.deriveChildNode(a, d), I(f), !h.isEqual(e, f))) throw j.error("CKD check failed", {
                parent: a,
                jsChild: e,
                pluginChild: f
            }), new Error("Child node derivation failed");
            return e
        }

        function I(a) {
            a.public_key = a.public_key.toUpperCase(), a.chain_code = a.chain_code.toUpperCase(), a.fingerprint = a.fingerprint.toString(), a.child_num = a.child_num.toString(), a.depth = a.depth.toString()
        }

        function J(a, b) {
            var c = K(a),
                d = L(c.derive(b));
            return d.path = a.path.concat([b]), d
        }

        function K(a) {
            var b = new g(a.chain_code, "hex"),
                c = new g(a.public_key, "hex"),
                f = d.Point.decodeFrom(e.ECPubKey.curve, c),
                h = new e.HDNode(f, b);
            return h.path = a.path, h.depth = +a.depth, h.index = a.child_num, h.parentFingerprint = a.fingerprint, h
        }

        function L(a) {
            return {
                path: a.path,
                depth: a.depth,
                child_num: a.index,
                fingerprint: a.parentFingerprint,
                public_key: a.pubKey.toHex(),
                chain_code: a.chainCode.toString("hex")
            }
        }

        function M(a) {
            return l(null, a)
        }

        function N(a, b, c) {
            var d = a();
            return d ? d.then(null, function(d) {
                if (void 0 !== c && 1 > c) throw d;
                var e = function() {
                    return N(a, b, c ? c - 1 : c)
                };
                return m(e, b)
            }) : i.reject("Cancelled")
        }

        function O(a) {
            var b, c = i.defer();
            return n.path() !== a ? (n.path(a), b = o.$on("$locationChangeSuccess", function() {
                c.resolve(), b()
            })) : c.resolve(), c.promise
        }
        this.stringToBytes = p, this.bytesToString = q, this.base64ToBytes = r, this.bytesToBase64 = s, this.hexToBytes = t, this.bytesToHex = u, this.utf8ToHex = v, this.hexToUtf8 = w, this.amount2str = x, this.str2amount = y, this.sha256x2 = z, this.httpPoll = A, this.xprv2node = B, this.xpub2node = C, this.node2xpub = D, this.node2address = E, this.address2str = F, this.decodeAddress = G, this.deriveChildNode = H, this.tick = M, this.endure = N, this.redirect = O
    }]),
    function() {
        function a(a, b, c) {
            return "undefined" == typeof c || 0 === +c ? Math[a](b) : (b = +b, c = +c, isNaN(b) || "number" != typeof c || c % 1 !== 0 ? 0 / 0 : (b = b.toString().split("e"), b = Math[a](+(b[0] + "e" + (b[1] ? +b[1] - c : -c))), b = b.toString().split("e"), +(b[0] + "e" + (b[1] ? +b[1] + c : c))))
        }
        Math.round10 || (Math.round10 = function(b, c) {
            return a("round", b, c)
        }), Math.floor10 || (Math.floor10 = function(b, c) {
            return a("floor", b, c)
        }), Math.ceil10 || (Math.ceil10 = function(b, c) {
            return a("ceil", b, c)
        })
    }(), angular.module("webwalletApp").directive("slider", function() {
        "use strict";
        return {
            require: "ngModel",
            link: function(a, b, c, d) {
                b.on("slide", function(a) {
                    d.$setViewValue(a.value)
                }).trigger({
                    type: "slide",
                    value: b.attr("data-slider-value")
                }).slider()
            }
        }
    }), angular.module("webwalletApp").value("storage", this.localStorage), angular.module("webwalletApp").value("temporaryStorage", this.sessionStorage || {}), angular.module("webwalletApp").service("udevError", ["trezor", "trezorApi", "flash", "$q", function(a, b, c, d) {
        "use strict";
        this._makesSenseAsking = function() {
            return a instanceof b.ChromeExtensionTransport ? 0 !== window.navigator.platform.lastIndexOf("Linux") ? !1 : -1 === window.navigator.userAgent.indexOf("CrOS") ? !0 : !1 : !1
        }, this.errorStatus = !1, this.getCurrentErrorStatus = function() {
            var b;
            return b = this._makesSenseAsking() ? a.udevStatus().then(function(a) {
                return "display" === a ? !0 : !1
            }) : d.when(!1), b.then(function(a) {
                this.errorStatus = a
            }.bind(this)), b
        }, this.getCurrentErrorStatus()
    }]), angular.module("webwalletApp").service("deviceService", ["trezor", "trezorApi", "TrezorDevice", "deviceList", "$rootScope", "$location", function(a, b, c, d, e, f) {
        "use strict";

        function g(e) {
            a instanceof b.PluginTransport && (e.on(c.EVENT_SEND, d.pauseWatch.bind(d)), e.on(c.EVENT_ERROR, d.resumeWatch.bind(d)), e.on(c.EVENT_RECEIVE, d.resumeWatch.bind(d)))
        }

        function h(a) {
            c.EVENT_TYPES.forEach(function(b) {
                i(e, a, b)
            })
        }

        function i(a, b, d) {
            b.on(d, function() {
                var e = [].slice.call(arguments);
                e.unshift(b), e.unshift(c.EVENT_PREFIX + d), a.$broadcast.apply(a, e)
            })
        }

        function j(a) {
            return a.initializeAccounts()
        }

        function k() {
            var a = d.getDefault();
            return a ? void d.navigateToFirstAccount(a) : void f.path("/")
        }

        function l(a) {
            if (a.dev) {
                if (!a.dev.isConnected()) return void e.$broadcast(q, a);
                n = !0, e.$broadcast(p, a), d.abortHook()
            }
        }

        function m(a) {
            return n ? (n = !1, void d.forget(a)) : void e.$broadcast(o, a)
        }
        var n = !1,
            o = "device.askForget",
            p = "device.askDisconnect",
            q = "device.closeDisconnect";
        this.EVENT_ASK_FORGET = o, this.EVENT_ASK_DISCONNECT = p, this.EVENT_CLOSE_DISCONNECT = q, d.registerBeforeInitHook(g), d.registerBeforeInitHook(h), d.registerBeforeInitHook(d.navigateToFirstAccount.bind(d), 20), d.registerAfterInitHook(j, 30), d.registerDisconnectHook(m), d.registerForgetHook(l), d.registerAfterForgetHook(k), d.watch(d.POLLING_PERIOD), this.forgetRequestCancelled = function() {
            n = !1
        }
    }]), angular.module("webwalletApp").value("FIRMWARE_LIST_URL", "https://mytrezor.s3.amazonaws.com/firmware/releases.json"), angular.module("webwalletApp").service("firmwareService", ["FIRMWARE_LIST_URL", "$http", "$rootScope", "deviceList", function(a, b, c, d) {
        "use strict";

        function e() {
            var a = d.all();
            return 0 === a.length ? "" : a.map(function(a) {
                return a.firmwareString()
            }).join(",")
        }

        function f(a) {
            return [+a.major_version, +a.minor_version, +a.patch_version]
        }

        function g() {
            return m.then(function(a) {
                return a.data[0]
            })
        }

        function h(a) {
            return m.then(function(b) {
                return j(a, b.data)
            })
        }

        function i(a) {
            var b = "54525a52";
            return a.substr(0, b.length) === b && a.length >= 8192 && a.length <= 917504
        }

        function j(a, b) {
            var c, d = b[0],
                e = f(a);
            if (d && !(k(d.version, e) < 1)) {
                for (c = 0; c < b.length && 0 !== k(b[c], a); c += 1)
                    if (b[c].required) {
                        d.required = !0;
                        break
                    }
                return d
            }
        }

        function k(a, b) {
            return a[0] - b[0] ? a[0] - b[0] : a[1] - b[1] ? a[1] - b[1] : a[2] - b[2] ? a[2] - b[2] : 0
        }
        var l = (new Date).getTime(),
            m = b.get(a + "?t=" + l + "&c=" + e()),
            n = !1;
        this.EVENT_CONNECT = "firmware.connect", this.EVENT_DISCONNECT = "firmware.disconnect", this.EVENT_BOOTLOADER = "firmware.bootloader", this.EVENT_NORMAL = "firmware.normal", this.EVENT_CANDIDATE = "firmware.candidate", this.EVENT_OUTDATED = "firmware.outdated", d.registerBeforeInitHook(function(a) {
            c.$broadcast(this.EVENT_CONNECT, a)
        }.bind(this), 5), d.registerDisconnectHook(function(a) {
            c.$broadcast(this.EVENT_DISCONNECT, a)
        }.bind(this), 5), d.registerAfterInitHook(function(a) {
            return a.features.bootloader_mode ? (c.$broadcast(this.EVENT_BOOTLOADER, a), n && d.abortHook(), g().then(function(b) {
                n = !0, c.$broadcast(this.EVENT_CANDIDATE, {
                    dev: a,
                    firmware: b
                }), d.abortHook()
            }.bind(this))) : (c.$broadcast(this.EVENT_NORMAL, a), n && d.abortHook(), h(a.features).then(function(b) {
                b && (b.required && (n = !0), c.$broadcast(this.EVENT_OUTDATED, {
                    dev: a,
                    firmware: b,
                    version: f(a.features)
                }), b.required && d.abortHook())
            }.bind(this)))
        }.bind(this), 10), d.registerDisconnectHook(function() {
            n && d.abortHook()
        }, 10), this.download = function(a) {
            return b.get(a.url).then(function(a) {
                if (!i(a.data)) throw new Error("Downloaded firmware is invalid");
                return a.data
            })
        }, this.setModalOpen = function(a) {
            n = a
        }, this.isModalOpen = function() {
            return n
        }
    }]), angular.module("webwalletApp").factory("deviceList", ["_", "$q", "config", "utils", "flash", "trezor", "trezorApi", "TrezorDevice", "ItemStorage", "modalOpener", "udevError", "TrezorBackend", "$location", function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
        "use strict";

        function n() {
            this._devicesLocalStorage = [], this._devicesTempStorage = [], this._watchPaused = !1, this._enumerateInProgress = !1, this._enumerateCanWait = !1, this._beforeInitHooks = [], this._afterInitHooks = [], this._disconnectHooks = [], this._forgetHooks = [], this._afterForgetHooks = [], this._restore()
        }
        n.prototype.STORAGE_DEVICES = "trezorDevices", n.prototype.STORAGE_VERSION = "trezorVersion", n.prototype.POLLING_PERIOD = 1e3, n.prototype.DEFAULT_HOOK_PRIORITY = 50, n.prototype.DEFAULT_HOOK_NAME = "anonymous", n.prototype._restore = function() {
            var a = {
                type: h,
                version: c.storageVersion,
                keyItems: this.STORAGE_DEVICES,
                keyVersion: this.STORAGE_VERSION,
                isLocalStorage: !0
            };
            this._storage = new i(a), a.isLocalStorage = !1, this._tempStorage = new i(a), this._devicesLocalStorage = this._storage.init(), this._devicesTempStorage = this._tempStorage.init(), this._devicesBothStorages().forEach(function(a) {
                a.init()
            })
        }, n.prototype._devicesBothStorages = function() {
            return this._devicesLocalStorage.concat(this._devicesTempStorage)
        }, n.prototype.get = function(b) {
            var c;
            if (b.id) c = {
                id: b.id
            };
            else if (b.path) c = {
                path: b.path
            };
            else {
                if (!b) return;
                c = {
                    id: b
                }
            }
            return a.find(this._devicesBothStorages(), c)
        }, n.prototype.existsConnected = function(a) {
            var b = this.get(a);
            return void 0 === b ? !1 : b.isConnected() ? !0 : !1
        }, n.prototype.addTemp = function(a) {
            this._devicesTempStorage.push(a)
        }, n.prototype.getDefault = function() {
            return this.all()[0]
        }, n.prototype.all = function() {
            return a.filter(this._devicesBothStorages(), function(a) {
                return a.shouldShow()
            })
        }, n.prototype.count = function() {
            return this.all().length
        }, n.prototype.remove = function(b, c) {
            void 0 === c && (c = !1);
            var d = {};
            c || b.destroy(), b.id ? d.id = b.id : b.path && (d.path = b.path), a.remove(this._devicesTempStorage, d), a.remove(this._devicesLocalStorage, d)
        }, n.prototype.moveToLocal = function(a) {
            this.remove(a, !0), this._devicesLocalStorage.push(a)
        }, n.prototype.moveToTemp = function(a) {
            this.remove(a, !0), this._devicesTempStorage.push(a)
        }, n.prototype.forget = function(a, c, d) {
            return b.when({
                dev: a,
                requireDisconnect: c,
                customText: d
            }).then(this._execHooks(this._forgetHooks)).then(function(a) {
                this.remove(a.dev)
            }.bind(this)).then(this._execHooks(this._afterForgetHooks))
        }, n.prototype.watch = function(a) {
            var c, e = d.tick(a),
                f = b.defer();
            return this._progressWithConnected(f), e.then(null, null, function() {
                this._progressWithConnected(f)
            }.bind(this)), c = this._progressWithDescriptorDelta(f.promise), c.then(null, null, function(a) {
                a && (a.added.forEach(this._connect.bind(this)), a.removed.forEach(this._disconnect.bind(this)))
            }.bind(this)), e
        }, n.prototype.pauseWatch = function() {
            this._watchPaused = !0
        }, n.prototype.resumeWatch = function() {
            this._watchPaused = !1
        }, n.prototype._progressWithConnected = function(a) {
            this._watchPaused || this._enumerateInProgress || (this._enumerateInProgress = !0, f.enumerate(this._enumerateCanWait).then(function(b) {
                a.notify(b), this._enumerateCanWait = !0, this._enumerateInProgress = !1
            }.bind(this)))
        }, n.prototype._progressWithDescriptorDelta = function(a) {
            var b, c = [];
            return a.then(null, null, function(a) {
                return a ? (b = c, c = a, this._computeDescriptorDelta(b, a)) : void 0
            }.bind(this))
        }, n.prototype._computeDescriptorDelta = function(b, c) {
            return {
                added: a.filter(c, function(c) {
                    return !a.find(b, {
                        path: c.path
                    })
                }),
                removed: a.filter(b, function(b) {
                    return !a.find(c, {
                        path: b.path
                    })
                })
            }
        }, n.prototype._connect = function(a) {
            var c = new h({
                path: a.path
            });
            f.acquire(a).then(function(a) {
                var b = new g.Session(f, a.session);
                return c.connect(b), c.initializeDevice()
            }.bind(this)).catch(function(a) {
                throw c.disconnect(), a
            }).then(function() {
                return k.getCurrentErrorStatus()
            }).then(function() {
                var a = this.get(c.id);
                return a ? (a.connect(c._session), a.path = c.path, a.features = c.features, c = a) : this.addTemp(c), c
            }.bind(this)).then(function(a) {
                return a.addSessionListeners(), a
            }).then(function(a) {
                return a.withLoading(function() {
                    return b.when(a).then(this._execHooks(this._beforeInitHooks)).then(this._execHooks(this._afterInitHooks))
                }.bind(this))
            }.bind(this)).catch(function(a) {
                a instanceof this.DeviceListException || (k.getCurrentErrorStatus().then(function(b) {
                    b === !1 && e.error(a.message || "Loading device failed")
                }), console.log("[deviceList] Catched error, printing stack"), console.log(a), console.log(a.stack))
            }.bind(this))
        }, n.prototype._registerHook = function(a, b, c, d) {
            a.push({
                fn: b,
                priority: c || this.DEFAULT_HOOK_PRIORITY,
                name: d || b.name || this.DEFAULT_HOOK_NAME
            })
        }, n.prototype._execHooks = function(a) {
            return function(c) {
                function d(g) {
                    var h;
                    return g === f ? void e.resolve(c) : (h = a[g].fn.apply(window, [c]), void(void 0 !== h ? b.when(h).then(function() {
                        d(g + 1)
                    }, function(a) {
                        e.reject(a)
                    }) : d(g + 1)))
                }
                var e = b.defer(),
                    f = a.length;
                return a = this._sortHooks(a), d(0), e.promise
            }.bind(this)
        }, n.prototype.registerBeforeInitHook = function(a, b, c) {
            this._registerHook(this._beforeInitHooks, a, b, c)
        }, n.prototype.registerAfterInitHook = function(a, b, c) {
            this._registerHook(this._afterInitHooks, a, b, c)
        }, n.prototype.registerDisconnectHook = function(a, b, c) {
            this._registerHook(this._disconnectHooks, a, b, c)
        }, n.prototype.registerForgetHook = function(a, b, c) {
            this._registerHook(this._forgetHooks, a, b, c)
        }, n.prototype.registerAfterForgetHook = function(a, b, c) {
            this._registerHook(this._afterForgetHooks, a, b, c)
        }, n.prototype._disconnect = function(a) {
            var c = {
                    path: a.path
                },
                d = this.get(c);
            return d ? (d.disconnect(), b.when(d).then(this._execHooks(this._disconnectHooks))) : void 0
        }, n.prototype.navigateTo = function(a, b) {
            if (a.shouldShow()) {
                var c = "/device/" + a.id;
                (b || 0 !== m.path().indexOf(c)) && m.path(c)
            }
        }, n.prototype.navigateToFirstAccount = function(a, b) {
            if (a.shouldShow()) {
                var c, d = "/device/" + a.id;
                c = a.isEmpty() || 0 === a.accounts.length && !a.isConnected() ? d : d + "/account/0";
                var e = !0;
                0 === m.path().indexOf(d) && (e = !1), j.isModalOpened() && (e = a.features.passphrase_protection ? !0 : !1), b && (e = !0), e && m.path(c)
            }
        }, n.prototype._sortHooks = function(b) {
            return a.sortBy(b, function(a) {
                return a.priority
            })
        }, n.prototype.abortHook = function() {
            throw new this.DeviceListException
        }, n.prototype.DeviceListException = function() {}, n.prototype.runOnClose = function() {
            console.log("[deviceList] runOnClose()"), this.all().forEach(function(a) {
                a.runOnClose()
            })
        };
        var o = new n;
        return window.onbeforeunload = function() {
            l.runOnClose(), o.runOnClose()
        }, o
    }]), angular.module("webwalletApp").factory("ItemStorage", ["$rootScope", "storage", "temporaryStorage", "$location", function(a, b, c, d) {
        "use strict";

        function e(a) {
            this._type = a.type, this._version = a.version, this._keyItems = a.keyItems, this._keyVersion = a.keyVersion, this._usedStorage = a.isLocalStorage ? b : c;
            var e = /^([^#]*)#.*$/,
                f = d.absUrl().replace(e, "$1"),
                g = /^[^:]*:\/\/[^\/]*\//,
                h = f.replace(g, "");
            this._prefix = h
        }
        return e.prototype._type = null, e.prototype._version = null, e.prototype._keyItems = null, e.prototype._keyVersion = null, e.prototype.init = function() {
            return this._watch(this._load())
        }, e.prototype._load = function() {
            return this._deserialize(this._restore())
        }, e.prototype._watch = function(b) {
            return a.$watch(function() {
                return this._serialize(b)
            }.bind(this), function(a) {
                this._store(a)
            }.bind(this), !0), b
        }, e.prototype._serialize = function(a) {
            return a.map(function(a) {
                return a.serialize()
            })
        }, e.prototype._deserialize = function(a) {
            return a.map(function(a) {
                return this._type.deserialize(a)
            }.bind(this))
        }, e.prototype._store = function(a) {
            var b = JSON.stringify(a);
            return this._usedStorage[this._prefix + this._keyItems] = b, this._usedStorage[this._prefix + this._keyVersion] = this._version, b
        }, e.prototype._restore = function() {
            var a = this._usedStorage[this._prefix + this._keyItems],
                b = this._usedStorage[this._prefix + this._keyVersion];
            return a && b === this._version ? JSON.parse(a) : []
        }, e
    }]), angular.module("webwalletApp").factory("mockDevice", ["$q", function(a) {
        "use strict";

        function b(b) {
            return b.wipe = function() {
                return b.disconnect(), a.when(!0)
            }, b
        }
        return b
    }]), angular.module("webwalletApp").factory("TrezorDevice", ["_", "$q", "$log", "config", "utils", "$timeout", "$interval", "TrezorAccount", function(a, b, c, d, e, f, g, h) {
        "use strict";

        function i(a) {
            this.id = a.id || null, this.path = a.path || null, this.accounts = [], this.features = null, this.error = null, this.forgetOnDisconnect = null, this._passphrase = null, this._session = null, this._desc = null, this._loadingLevel = 0
        }
        return i.prototype.DEFAULT_LABEL = "My TREZOR", i.prototype.LABEL_MAX_LENGTH = 16, i.prototype.SESSION_TTL = 9e5, i.EVENT_PIN = "pin", i.EVENT_BUTTON = "button", i.EVENT_PASSPHRASE = "passphrase", i.EVENT_WORD = "word", i.EVENT_SEND = "send", i.EVENT_ERROR = "error", i.EVENT_RECEIVE = "receive", i.EVENT_CONNECT = "connect", i.EVENT_DISCONNECT = "disconnect", i.EVENT_PREFIX = "device.", i.EVENT_TYPES = [i.EVENT_PIN, i.EVENT_PASSPHRASE, i.EVENT_BUTTON, i.EVENT_WORD, i.EVENT_SEND, i.EVENT_ERROR, i.EVENT_RECEIVE], i.REQ_BUTTON_FIRMWARE = "ButtonRequest_FirmwareCheck", i.prototype.STATUS_LOADING = "loading", i.prototype.STATUS_CONNECTED = "connected", i.prototype.STATUS_DISCONNECTED = "disconnected", i.prototype.destroy = function() {
            this.disconnect(), this.unsubscribe()
        }, i.deserialize = function(a) {
            var b = new i(a);
            if ("string" == typeof a.passphrase) {
                console.log("[device] converting from old to new passphrase..."), console.log("[device] old: ", a.passphrase);
                var c = e.hexToBytes(a.passphrase);
                c = Array.prototype.slice.call(c), console.log("[device] new: ", c), b._passphrase = c
            } else b._passphrase = a.passphrase;
            return b.features = a.features, b.accounts = a.accounts.map(function(a) {
                return h.deserialize(a)
            }), b.forgetOnDisconnect = a.forgetOnDisconnect, b
        }, i.prototype.serialize = function() {
            return {
                id: this.id,
                path: this.path,
                passphrase: this._passphrase,
                features: this.features,
                accounts: this.accounts.map(function(a) {
                    return a.serialize()
                }),
                forgetOnDisconnect: this.forgetOnDisconnect
            }
        }, i.prototype.clearSessionAndReleaseSync = function() {
            this._session.clearSessionSync(), this._session.releaseSync()
        }, i.prototype.clearSession = function() {
            console.log("[device] clearing session");
            var a = this;
            return this._session.clearSession().then(function() {
                a.maybeReloadFeatures()
            })
        }, i.prototype.runOnClose = function() {
            null != this._session && (this._session.supportsSync ? this._callInProgress || this.clearSessionAndReleaseSync() : this.clearSession())
        }, i.prototype.setClearTimeout = function() {
            this.cancelClearTimeout(), this._lastActivityStamp = Math.floor(Math.floor(Date.now() / 1e3)), this._checkActivityTimeout = f(function() {
                this.isConnected() && (this._callInProgress || this.clearSession())
            }.bind(this), this.SESSION_TTL), this._lastActivityInterval = g(function() {
                var a = Math.floor(Math.floor(Date.now() / 1e3));
                this._activityDiff = a - this._lastActivityStamp
            }.bind(this), 1e3)
        }, i.prototype.timeToClear = function() {
            var a = this._activityDiff;
            null == this._activityDiff && (a = 0);
            var b = this.SESSION_TTL / 1e3 - a;
            if (0 > b) return "soon";
            var c = Math.floor(b / 60),
                d = b - 60 * c;
            return "in " + c + ":" + d
        }, i.prototype.cancelClearTimeout = function() {
            null != this._checkActivityTimeout && (f.cancel(this._checkActivityTimeout), g.cancel(this._lastActivityInterval))
        }, i.prototype.reloadFeatures = function() {
            return null != this.features && this.supports("getFeatures") ? this._session.getFeatures().then(function(a) {
                this.features = a.message
            }.bind(this)) : b.when()
        }, i.prototype.maybeReloadFeatures = function() {
            return null != this.features ? this.supports("getFeatures") ? this.reloadFeatures() : this.initializeDevice() : b.when()
        }, i.prototype.displayLock = function() {
            return "unlocked" === this.lockStatus()
        }, i.prototype.lockStatus = function() {
            return this._lockMakesSense() ? this._isUnlocked() ? "unlocked" : "locked" : "NA"
        }, i.prototype._isUnlocked = function() {
            return this.features.passphrase_protection ? this.features.pin_protection ? this.features.pin_cached && this.features.passphrase_cached : this.features.passphrase_cached : this.features.pin_protection ? this.features.pin_cached : !1
        }, i.prototype._lockMakesSense = function() {
            return this.supports("cacheInFeatures") ? this.status() !== this.STATUS_CONNECTED ? !1 : this.features.passphrase_protection || this.features.pin_protection : !1
        }, i.prototype.isLoading = function() {
            return !!this._loadingLevel || this.areAccountsLoading()
        }, i.prototype.withLoading = function(a) {
            var c = this;
            c._loadingLevel++;
            var d = a();
            return b.when(d).finally(function() {
                return c._loadingLevel--, 0 === c._loadingLevel ? c.maybeReloadFeatures() : b.when()
            }).then(function() {
                return d
            })
        }, i.prototype.status = function() {
            return this.isLoading() ? this.STATUS_LOADING : this.isConnected() ? this.STATUS_CONNECTED : this.STATUS_DISCONNECTED
        }, i.prototype.canSendTx = function() {
            return this.isConnected() && !this.isLoading()
        }, i.prototype.label = function() {
            return this.features && this.features.label ? this.features.label : this.DEFAULT_LABEL
        }, i.prototype.balance = function() {
            return this.accounts.reduce(function(a, b) {
                return a + b.balance
            }, 0)
        }, i.prototype.defaultCoin = function() {
            return a.find(this.features.coins, {
                coin_name: d.coin
            })
        }, i.prototype.supports = function(a) {
            return this.features && d.features[a] ? [this.features.major_version, this.features.minor_version, this.features.patch_version].join(".") >= d.features[a] : !1
        }, i.prototype.hasSavedPassphrase = function() {
            return !!this._passphrase
        }, i.prototype.checkPassphraseAndSave = function(a) {
            var b = this._hashPassphrase(a);
            return this._passphrase ? JSON.stringify(this._passphrase) === JSON.stringify(b) : (this._passphrase = b, !0)
        }, i.prototype._hashPassphrase = function(a) {
            var b = "TREZOR#" + this.id + "#" + a,
                c = e.sha256x2(b, {
                    asBytes: !0
                });
            return Array.prototype.slice.call(c)
        }, i.prototype.isConnected = function() {
            return !!this._session
        }, i.prototype.connect = function(a) {
            this._session = a, this.on = this._session.on.bind(this._session), this.once = this._session.once.bind(this._session), this.removeListener = this._session.removeListener.bind(this._session), this._callInProgress = !1
        }, i.prototype.addSessionListeners = function() {
            var a = function() {
                    this._callInProgress = !0
                }.bind(this),
                b = function() {
                    this.setClearTimeout(), this._callInProgress = !1
                }.bind(this);
            this.on("send", a), this.on("receive", b), this.on("error", b)
        }, i.prototype.disconnect = function() {
            this.cancelClearTimeout(), this._session && this._session.release(), this._session = null
        }, i.prototype.isEmpty = function() {
            return !this.features || !this.features.initialized
        }, i.prototype.initializeDevice = function() {
            function a() {
                return b.isConnected() ? b._session.initialize().then(function(a) {
                    var c = a.message;
                    return b.id = c.bootloader_mode ? b.path : c.device_id, b.error = null, a
                }, function(a) {
                    throw b.error = a.message || "Failed to initialize the device.", a
                }) : !1
            }
            var b = this,
                c = 3e3,
                d = 60;
            return e.endure(a, c, d).then(function(a) {
                return b.features = a.message
            }, function(a) {
                throw b.features = null, a
            })
        }, i.prototype.initializeAccounts = function() {
            var a = this;
            this.initializingAccounts = !0;
            var c;
            return c = this.isEmpty() ? this.unsubscribe().then(function() {
                return a.accounts = []
            }) : this.accounts.length ? b.when(this.accounts) : this.addAccount().then(function() {
                return a.discoverAccounts()
            }), c.then(function() {
                a.initializingAccounts = null
            })
        }, i.prototype.subscribe = function() {
            return b.all(this.accounts.map(function(a) {
                return a.subscribe()
            }))
        }, i.prototype.init = i.prototype.subscribe, i.prototype.unsubscribe = function() {
            return b.all(this.accounts.map(function(a) {
                return a.unsubscribe()
            }))
        }, i.prototype.account = function(b) {
            return a.find(this.accounts, {
                id: b
            })
        }, i.prototype.getDefaultAccount = function() {
            return this.accounts[0]
        }, i.prototype.accountPath = function(a, b) {
            return d.useBip44 ? [2147483692, (2147483648 | d.indices[b.coin_name]) >>> 0, (2147483648 | a) >>> 0] : [d.indices[b.coin_name], 2147483648, (2147483648 | a) >>> 0]
        }, i.prototype.canAddAccount = function() {
            var a = this.accounts[this.accounts.length - 1];
            return !(!this.isConnected() || this.isEmpty() || a && a.isEmpty())
        }, i.prototype.addAccount = function() {
            var a = this;
            return this.canAddAccount() ? this._createAccount(this.accounts.length).then(function(b) {
                return a.accounts.push(b), b.subscribe(), b
            }) : b.reject(new Error("Cannot add any more accounts"))
        }, i.prototype.canHideAccount = function(a) {
            if (null == a) return !0;
            var b = this.accounts[this.accounts.length - 1];
            return a.isEmpty() && a.id === b.id && this.accounts.length > 1
        }, i.prototype.hideAccount = function(b) {
            if (!this.canHideAccount(b)) throw new Error("Cannot hide this account");
            return a.remove(this.accounts, {
                id: b.id
            })
        }, i.prototype.discoveryIsSlow = function() {
            return this.accounts.some(function(a) {
                return a.isLoading() && a.subscribingIsSlow
            })
        }, i.prototype.areAccountsLoading = function() {
            return this.accounts.some(function(a) {
                return a.isLoading()
            })
        }, i.prototype.discoverAccounts = function() {
            function a(c) {
                return b._createAccount(c).then(function(d) {
                    return d.subscribe().then(function() {
                        return d.isEmpty() ? d.unsubscribe() : (b.accounts.push(d), a(c + 1))
                    })
                })
            }
            var b = this,
                c = this.accounts.length;
            return a(c).then(function() {
                return b.accounts
            })
        }, i.prototype._createAccount = function(a) {
            var b = this,
                c = this.defaultCoin(),
                f = this.accountPath(a, c),
                g = [0],
                i = f.concat(g),
                j = d.versions.Bitcoin;
            return b.withLoading(function() {
                function d(a, b) {
                    return b.reduce(function(a, b) {
                        return e.deriveChildNode(a, b)
                    }, a)
                }
                return b._session.getPublicKey(f).then(function(f) {
                    var k = f.message.node,
                        l = e.node2xpub(k, j),
                        m = k.xpub || l;
                    if (m !== l) throw new Error("Invalid public key transmission detected - invalid xpub check. Key: " + m + ", Received: " + k.xpub);
                    return b._session.getPublicKey(i).then(function(b) {
                        var f = b.message.node,
                            i = d(k, g),
                            l = e.node2xpub(f, j),
                            n = e.node2xpub(i, j);
                        if (l !== n) throw new Error("Invalid public key transmission detected - invalid child cross-check. Key: " + m + ", Computed: " + n + ", Received: " + l);
                        return new h(a, c, k)
                    })
                })
            })
        }, i.prototype.measureTx = function(a, b) {
            var c = this;
            return c.withLoading(function() {
                return c._session.measureTx(a.inputs, a.outputs, b)
            })
        }, i.prototype.signTx = function(a, b, c) {
            var d = this;
            return d.withLoading(function() {
                return d._session.signTx(a.inputs, a.outputs, b, c)
            })
        }, i.prototype.signMessage = function(a, b, c) {
            var d = this;
            return d.withLoading(function() {
                return d._session.signMessage(a, b, c)
            })
        }, i.prototype.verifyMessage = function(a, b, c) {
            var d = this;
            return d.withLoading(function() {
                return d._session.verifyMessage(a, b, c)
            })
        }, i.prototype.flash = function(a) {
            var b = this;
            return b._session.eraseFirmware().then(function() {
                return b._session.uploadFirmware(a)
            })
        }, i.prototype.wipe = function() {
            var a = this;
            return a.withLoading(function() {
                return a._session.initialize().then(function() {
                    return a._session.wipeDevice()
                }).then(function() {
                    return a.unsubscribe()
                })
            })
        }, i.prototype.reset = function(a) {
            var b = this,
                c = angular.copy(a);
            return b.withLoading(function() {
                return b._session.initialize().then(function() {
                    return b._session.resetDevice(c)
                }).then(function() {
                    return b.initializeDevice()
                }).then(function() {
                    return b.initializeAccounts()
                })
            })
        }, i.prototype.load = function(a) {
            var b = this,
                c = angular.copy(a);
            try {
                c.node = e.xprv2node(c.payload)
            } catch (d) {
                c.mnemonic = c.payload
            }
            return delete c.payload, b.withLoading(function() {
                return b._session.initialize().then(function() {
                    return b._session.loadDevice(c)
                }).then(function() {
                    return b.initializeDevice()
                }).then(function() {
                    return b.initializeAccounts()
                })
            })
        }, i.prototype.recover = function(a) {
            var b = this,
                c = angular.copy(a);
            return c.enforce_wordlist = !0, b.withLoading(function() {
                return b._session.initialize().then(function() {
                    return b._session.recoverDevice(c)
                }).then(function() {
                    return b.initializeDevice()
                }).then(function() {
                    return b.initializeAccounts()
                })
            })
        }, i.prototype.changeLabel = function(a) {
            var b = this;
            return a.length > this.LABEL_MAX_LENGTH && (a = a.slice(0, this.LABEL_MAX_LENGTH)), b.withLoading(function() {
                return b.maybeReloadFeatures().then(function() {
                    return b._session.applySettings({
                        label: a
                    })
                }).then(function() {
                    return b.maybeReloadFeatures()
                })
            })
        }, i.prototype.togglePassphrase = function(a) {
            var b = this;
            return b.withLoading(function() {
                return b.maybeReloadFeatures().then(function() {
                    return b._session.applySettings({
                        use_passphrase: !!a
                    })
                }).then(function() {
                    return b.maybeReloadFeatures()
                })
            })
        }, i.prototype.changePin = function(a) {
            var b = this;
            return b.withLoading(function() {
                return b.maybeReloadFeatures().then(function() {
                    return b._session.changePin(a)
                }).then(function() {
                    return b.maybeReloadFeatures()
                })
            })
        }, i.prototype.ratePin = function(b) {
            function c(a) {
                var b, c = 1;
                for (b = 2; a >= b; b++) c *= b;
                return c
            }
            var d, e;
            return b.length > 9 ? 0 : (d = a.uniq(b.split("")).length, e = c(9) / c(9 - d))
        }, i.prototype.verifyAddress = function(a, b) {
            var d = this.defaultCoin(),
                e = this;
            return e.withLoading(function() {
                return e._session.getAddress(a, d, !0).then(function(d) {
                    var e = d.message.address === b;
                    return e || c.error("[device] Address verification failed", {
                        path: a,
                        jsAddress: b,
                        trezorAddress: d.message.address
                    }), e
                })
            })
        }, i.prototype.shouldShow = function() {
            return this.features.bootloader_mode === !0 ? !1 : "bitcointrezor.com" !== this.features.vendor ? !1 : !0
        }, i.prototype.firmwareString = function() {
            return this.features.major_version + "." + this.features.minor_version + "." + this.features.patch_version
        }, i
    }]), angular.module("webwalletApp").config(["$httpProvider", function(a) {
        a.defaults.useXDomain = !0
    }]), angular.module("webwalletApp").value("backends", {}), angular.module("webwalletApp").factory("TrezorBackend", ["backends", "config", "utils", "$http", "$q", "$log", function(a, b, c, d, e, f) {
        "use strict";

        function g(a) {
            this.version = b.versions[a], this.config = b.backends[a] || {}, this._clientIdP = null, this._stream = null, this._streamError = !1, this._closing = !1, this._handlers = {}, this._lastHeight = null, this._lastHeightTime = null, this._keepConnected()
        }
        return g.RECONNECT_DELAY = 5e3, g.BLOCKHEIGHT_WINDOW = 12e4, g.singleton = function(a) {
            return this.singletonByName(a.coin_name)
        }, g.singletonByName = function(b) {
            return a[b] || (a[b] = new g(b)), a[b]
        }, g.prototype._streamUrl = function(a) {
            return null != a ? this.config.endpoint + "/lp/" + a : this.config.endpoint + "/lp"
        }, g.prototype._apiUrl = function(a) {
            return this.config.endpoint + "/trezor/" + a
        }, g.prototype._keepConnected = function() {
            c.endure(function() {
                return this.connect().then(function() {
                    return this._stream
                }.bind(this))
            }.bind(this), g.RECONNECT_DELAY)
        }, g.prototype.isConnected = function() {
            return this._clientIdP && this._stream
        }, g.prototype.isStreamError = function() {
            return this._streamError && window.navigator.onLine && !this._closing
        }, g.prototype.runOnClose = function() {
            this._closing = !0
        }, g.prototype.connect = function() {
            return this._clientIdP || this._openStream(), this._clientIdP
        }, g.prototype._openStream = function() {
            var a = this;
            f.log("[backend] Requesting client ID"), this._clientIdP = d.post(this._streamUrl(), {}).then(function(a) {
                if (!a.data || null == a.data.clientId) throw new Error("Invalid client ID");
                return f.log("[backend] Client ID received"), a.data.clientId
            }), this._clientIdP.catch(function(b) {
                f.error("[backed] Client ID error", b), a._clientIdP = null, a._streamError = !0
            }), this._clientIdP.then(function(b) {
                a._listenOnStream(b)
            })
        }, g.prototype._listenOnStream = function(a) {
            var b = this,
                d = this._streamUrl(a),
                e = 1e3;
            f.log("[backend] Listening on client ID", a), this._stream = c.httpPoll({
                method: "GET",
                url: d
            }, e), this._streamError = !1, this._stream.catch(function(a) {
                f.error("[backed] Stream error", a), b._stream = null, b._clientIdP = null, this._streamError = !0
            }.bind(this)), this._stream.then(null, null, function(a) {
                204 !== a.status && a.data.forEach && a.data.forEach(b._processMessage.bind(b))
            })
        }, g.prototype._processMessage = function(a) {
            var b = a.publicMaster;
            return this._handlers[b] ? void this._handlers[b].forEach(function(b) {
                b(a)
            }) : void f.warn("[backend] Received a message for unknown xpub", b)
        }, g.prototype.disconnect = function() {
            f.log("[backend] Closing stream"), this._stream && this._stream.cancel(), this._stream = null, this._clientIdP = null, this._streamError = !1
        }, g.prototype.subscribe = function(a, b) {
            var e = this,
                g = c.node2xpub(a, this.version),
                h = {
                    publicMaster: g,
                    after: this.config.after || "2014-01-01",
                    lookAhead: this.config.lookAhead || 20,
                    firstIndex: this.config.firstIndex || 0
                };
            return this._handlers[g] = this._handlers[g] || [], this._handlers[g].push(b), f.log("[backend] Subscribing", g), this.connect().then(function(a) {
                return d.post(e._streamUrl(a), h).then(function(a) {
                    e._processMessage(a.data)
                })
            })
        }, g.prototype.unsubscribe = function(a) {
            var b = c.node2xpub(a, this.version);
            delete this._handlers[b]
        }, g.prototype.send = function(a, b) {
            if (f.log("[backend] Sending", a), this.config.insightEndpoint && this.config.sendWithInsight) return this.config.sendWithBop ? this._insightSend(a, b).then(function() {
                return this._generalSend(a, b)
            }.bind(this)) : this._insightSend(a, b);
            if (this.config.sendWithBop) return this._generalSend(a, b);
            throw new Error("Neither bop nor insight set")
        }, g.prototype._insightSend = function(a, b) {
            if ("string" == typeof this.config.insightEndpoint) return this._insightSendEndpoint(a, b);
            var c = this.config.insightEndpoint.map(function(c) {
                return this._insightSendEndpoint(a, b, c)
            }.bind(this));
            return c.reduce(function(a, b) {
                return a.catch(function() {
                    return b
                })
            }, e.reject(""))
        }, g.prototype._insightSendEndpoint = function(a, b, e) {
            var f = e + "/api/tx/send";
            return d.post(f, {
                rawtx: c.bytesToHex(a)
            })
        }, g.prototype._generalSend = function(a, b) {
            return d.post(this._apiUrl("send"), {
                transaction: c.bytesToBase64(a),
                transactionHash: c.bytesToBase64(b)
            })
        }, g.prototype.transactions = function(a) {
            var b = c.node2xpub(a, this.version);
            return f.log("[backend] Requesting tx history for", b), d.get(this._apiUrl(b + "/transactions")).then(function(a) {
                return a.data
            })
        }, g.prototype.transaction = function(a, b) {
            var e = c.node2xpub(a, this.version);
            return f.log("[backend] Looking up tx", b, "for", e), d.get(this._apiUrl(e + "/transactions/" + b)).then(function(a) {
                return a.data
            })
        }, g.prototype.currentHeight = function() {
            var a = this._cachedBlockHeight();
            return null !== a ? (f.log("[backend] Reusing old block height"), e.when(a)) : (f.log("[backend] Looking up current block height"), this._currentHeight().then(function(a) {
                return this._saveBlockHeight(a), a
            }.bind(this)))
        }, g.prototype._currentHeight = function() {
            var a = this.config.insightEndpoint + "/api/status?q=getInfo";
            return d.get(a, {
                timeout: 2500
            }).then(function(a) {
                var b = a.data.info.blocks;
                if ("number" != typeof b) throw new TypeError("Expected number of blocks");
                return b - 1
            })
        }, g.prototype._cachedBlockHeight = function() {
            var a = this._lastHeightTime,
                b = this._lastHeight;
            if (null !== a && null !== b) {
                var c = Date.now() - a;
                if (c < g.BLOCKHEIGHT_WINDOW) return b
            }
            return null
        }, g.prototype._saveBlockHeight = function(a) {
            this._lastHeightTime = Date.now(), this._lastHeight = a
        }, g.runOnClose = function() {
            Object.keys(a).forEach(function(b) {
                a[b].runOnClose()
            })
        }, g
    }]), angular.module("webwalletApp").factory("TrezorAccount", ["config", "utils", "TrezorBackend", "_", "bitcoin", "$timeout", "$log", "$q", function(a, b, c, d, e, f, g, h) {
        "use strict";

        function i(a) {
            switch (a.coin_name) {
                case "Testnet":
                    return e.networks.testnet;
                case "Bitcoin":
                    return e.networks.bitcoin;
                default:
                    throw new Error("Unknown coin " + a.coin_name)
            }
        }

        function j(a, d, e, f) {
            this.id = "" + a, this.coin = d, this.node = e, this.utxos = null, this.balance = null, this.transactions = null, this.network = i(this.coin), this._wallet = {
                txs: {},
                outputs: {}
            }, this._deferred = null, this._backend = c.singleton(d), this._externalNode = b.deriveChildNode(this.node, 0), this._changeNode = b.deriveChildNode(this.node, 1), null == f ? this._cachedAddresses = [] : (this._cachedAddresses = f, this._cachedAddresses.forEach(function(a) {
                null != a && (a.verification = !1)
            }))
        }

        function k(a) {
            this.value = a, this.message = a.message, this.toString = function() {
                return this.message + JSON.stringify(this.value)
            }
        }
        j.deserialize = function(a) {
            return new j(a.id, a.coin, a.node, a._cachedAddresses)
        }, j.prototype.serialize = function() {
            return {
                id: this.id,
                coin: this.coin,
                node: this.node,
                _cachedAddresses: this._cachedAddresses
            }
        }, j.prototype.isOffline = function() {
            return !this._backend.isConnected()
        }, j.prototype.isStreamError = function() {
            return this._backend.isStreamError()
        }, j.prototype.isEmpty = function() {
            return !this.transactions || !this.transactions.length
        }, j.prototype.isInconsistent = function() {
            return !this.isEmpty() && this.transactions && this.balance && (!this.transactions[0].analysis.balance || !this.transactions[0].analysis.balance === this.balance)
        }, j.prototype.label = function() {
            return "Account #" + (+this.id + 1)
        }, j.prototype.address = function(a) {
            var b = Math.max(this._externalNode.offset || 0, this._externalNode.unconfirmedOffset || 0);
            return this._deriveAddressCached(this._externalNode, b + a)
        }, j.prototype._deriveAddressCached = function(a, b) {
            return this._cachedAddresses[b] ? this._cachedAddresses[b] : this._deriveAddress(a, b)
        }, j.prototype._deriveAddress = function(a, c) {
            console.log("[account] Deriving address", c);
            var d = b.deriveChildNode(a, c),
                e = b.node2address(d, this.coin.address_type),
                f = {
                    path: d.path,
                    address: e,
                    index: c
                };
            return this._cachedAddresses[c] = f, f
        }, j.prototype.maxLiveAddressIndex = function(a) {
            return (this._externalNode.offset || 0) + a - 1
        }, j.prototype.publicKey = function() {
            return b.node2xpub(this.node, a.versions[this.coin.coin_name])
        }, j.prototype.usedAddresses = function(a) {
            var b, c = [];
            if (!this.transactions) return c;
            a = !!a;
            var d = a ? 1 : 0;
            if (this.transactions.forEach(function(b) {
                    (a || "recv" === b.analysis.type || "self" === b.analysis.type) && this.getTxOuts(b).forEach(function(b) {
                        if (!a || b.path) {
                            var e = b.path[b.path.length - 2],
                                f = b.path[b.path.length - 1];
                            e === d && (c[f] ? c[f].received += b.amount : c[f] = {
                                path: b.path,
                                index: f,
                                address: b.address,
                                received: b.amount
                            })
                        }
                    })
                }.bind(this)), !a)
                for (b = 0; b < c.length; b++) c[b] || (c[b] = this._deriveAddressCached(this._externalNode, b), c[b].received = null);
            return c
        }, j.prototype.unusedAddresses = function(a) {
            var b, c = [];
            for (b = 0; a > b; b++) c.push(this.address(b));
            return c
        }, j.prototype.lazyUnusedAddresses = function(a) {
            var b = this;
            return h(function(c) {
                function d(f) {
                    e[f] = b.address(f), f === a - 1 ? c(e) : setTimeout(d, 1, f + 1)
                }
                var e = [];
                d(0)
            })
        }, j.prototype.getOutPath = function(a) {
            var b, c = a.outs.length;
            for (b = 0; c > b; b += 1)
                if (a.outs[b].path) return a.outs[b].path;
            return null
        }, j.prototype.getTxOuts = function(a) {
            var b, c, d, f, g = [];
            for (c = a.outs.length, b = 0; c > b; b += 1)
                if (d = a.outs[b], d.path) {
                    try {
                        f = e.Address.fromOutputScript(d.script, this.network)
                    } catch (h) {
                        continue
                    }
                    g.push({
                        path: d.path,
                        address: f.toString(),
                        amount: d.value,
                        ix: d.index
                    })
                }
            return g
        }, j.prototype.sendTx = function(a, c) {
            var e, f, g = this;
            return e = d.uniq(a.inputs, "prev_hash"), f = e.map(function(a) {
                return g._backend.transaction(g.node, a.prev_hash)
            }), f = h.all(f).then(function(a) {
                return a.map(function(a) {
                    return {
                        hash: a.hash,
                        version: a.version,
                        inputs: a.inputs.map(function(a) {
                            return {
                                prev_hash: a.sourceHash,
                                prev_index: a.ix >>> 0,
                                sequence: a.sequence >>> 0,
                                script_sig: b.bytesToHex(b.base64ToBytes(a.script))
                            }
                        }),
                        bin_outputs: a.outputs.map(function(a) {
                            return {
                                amount: a.value,
                                script_pubkey: b.bytesToHex(b.base64ToBytes(a.script))
                            }
                        }),
                        lock_time: a.lockTime
                    }
                })
            }), f.then(function(d) {
                return c.signTx(a, d, g.coin).then(function(c) {
                    var d, e, f, h = c.message,
                        i = h.serialized.serialized_tx,
                        j = g._serializedToTx(i);
                    if (!j) throw new Error("Failed to parse signed transaction");
                    if (!g._verifyTx(a, j)) throw new Error("Failed to verify signed transaction");
                    return d = b.hexToBytes(i), e = b.sha256x2(d, {
                        asBytes: !0
                    }), f = Array.prototype.slice.call(e), g._backend.send(d, f).then(function() {
                        return {
                            bytes: d,
                            hash: f
                        }
                    }, function(a) {
                        throw new k({
                            message: a.message || "Failed to send transaction to the backend. Server returned: `" + JSON.stringify(a) + "`.",
                            bytes: d
                        })
                    })
                })
            })
        }, j.prototype._serializedToTx = function(a) {
            try {
                return e.Transaction.fromHex(a)
            } catch (b) {
                return g.error("Failed to deserialize tx:", b), null
            }
        }, j.prototype._verifyTx = function(a, b) {
            return console.log("veryfying"), console.log(this._verifyTxSize(a, b)), console.log(this._verifyTxAmounts(a, b)), console.log(this._verifyTxScripts(a, b)), this._verifyTxSize(a, b) && this._verifyTxAmounts(a, b) && this._verifyTxScripts(a, b)
        }, j.prototype._verifyTxSize = function(a, b) {
            return a.inputs.length === b.ins.length && a.outputs.length === b.outs.length
        }, j.prototype._verifyTxAmounts = function(a, b) {
            var c = d.zip(a.outputs, b.outs);
            return d.every(c, function(a) {
                var b = a[0].amount,
                    c = a[1].value;
                return b === c
            })
        }, j.prototype._verifyTxScripts = function(a, c) {
            function e(a) {
                var b = f(a);
                switch (a.script_type) {
                    case "PAYTOADDRESS":
                        return [118, 169, 20].concat(b).concat([136, 172]);
                    case "PAYTOSCRIPTHASH":
                        return [169, 20].concat(b).concat([135]);
                    default:
                        throw new Error("Unknown script type: " + a.script_type)
                }
            }

            function f(a) {
                var c, d, e, f = a.address,
                    h = a.address_n,
                    i = [g._externalNode, g._changeNode];
                f || (d = h[h.length - 2], e = h[h.length - 1], c = b.deriveChildNode(i[d], e), f = b.node2address(c, g.coin.address_type));
                var j = b.decodeAddress(f).hash,
                    k = Array.prototype.slice.call(j);
                return k
            }
            var g = this,
                h = d.zip(a.outputs, c.outs);
            return d.every(h, function(a) {
                var c = b.bytesToHex(e(a[0])),
                    d = b.bytesToHex(a[1].script.buffer);
                return console.log("equality of:"), console.log(c), console.log(d), c === d
            })
        };
        var l = 5340,
            m = function(a, b) {
                this.message = a, this.field = b, this.toString = function() {
                    return this.field + ": " + this.message
                }
            },
            n = "amount",
            o = "address";
        return j.prototype.FIELD_AMOUNT = n, j.prototype.FIELD_ADDRESS = o, j.FIELD_ADDRESS = o, j.FIELD_AMOUNT = n, j.prototype.buildTxOutput = function(c, d) {
            var e, f, g = this.coin.address_type,
                h = a.scriptTypes[this.coin.coin_name];
            if (l > d) throw new m("Amount is too low", this.FIELD_AMOUNT);
            try {
                f = b.decodeAddress(c)
            } catch (i) {
                f = null
            }
            if (!f) throw new m("Invalid address", this.FIELD_ADDRESS);
            if (f.version === +g && (e = "PAYTOADDRESS"), !e && h && h[f.version] && (e = h[f.version]), !e) throw new m("Invalid address version", this.FIELD_ADDRESS);
            return {
                script_type: e,
                address: c,
                amount: d
            }
        }, j.prototype.findUnspents = function() {
            function a(a) {
                return d.find(c.transactions, {
                    hash: a
                })
            }

            function b(a) {
                var b = /^0+$/;
                return a.ins.some(function(a) {
                    return b.test(a.hash)
                })
            }
            var c = this;
            return c._backend.currentHeight().then(function(d) {
                return c.utxos.filter(function(c) {
                    var e = a(c.transactionHash);
                    return e && b(e) ? d - e.block > 100 : !0
                })
            }, function(a) {
                return console.warn("[account] Error while retrieving current height, immature coinbase inputs will be included in the UTXO set", a), c.utxos
            })
        }, j.prototype.buildTx = function(b, c) {
            function d(f, i) {
                var j = e._constructTx(f, b, i);
                if (!j) return h.reject(new Error("Not enough funds"));
                var k = a.feePerKb;
                c && (k = 5 * k);
                var l = Math.ceil(e._measureTx(j) / 1e3),
                    m = j.inputSum - j.outputSum,
                    n = l * k;
                return g.log("[account] Measured tx of", l, "KB, est. fee is", n), n > m ? (g.log("[account] Fee is too high for current inputs, measuring again"), d(f, n)) : n === j.fee ? (g.log("[account] Estimated fee matches"), j) : (g.log("[account] Re-constructing with final fee"), e._constructTx(f, b, n))
            }
            var e = this;
            return this.findUnspents().then(function(a) {
                return d(a, 0)
            })
        }, j.prototype._measureTx = function(a) {
            return 10 + 149 * a.inputs.length + 35 * a.outputs.length
        }, j.prototype._constructTx = function(a, b, c) {
            var e, f, h, i, j, k;
            return e = Math.max(this._changeNode.unconfirmedOffset || 0, this._changeNode.offset || 0), f = this._changeNode.path.concat([e]), g.log("[account] Constructing tx with fee attempt", c, "for", b), k = b.reduce(function(a, b) {
                return a + b.amount
            }, 0), (h = this._selectUtxos(a, k + c)) ? (j = h.reduce(function(a, b) {
                return a + b.value
            }, 0), i = j - k - c, i >= l ? (b = b.concat([{
                script_type: "PAYTOADDRESS",
                address_n: f,
                amount: i
            }]), g.log("[account] Added change output", b[b.length - 1])) : (i = 0, c = j - k, g.log("[account] Change amount", i, "is below dust limit", l, ", adding to fee"), g.log("[account] New fee:", c)), b = d.sortBy(b, function(a) {
                return -a.amount
            }), {
                fee: c,
                change: i,
                inputSum: j,
                outputSum: k,
                outputs: b,
                inputs: h.map(function(a) {
                    return {
                        prev_hash: a.transactionHash,
                        prev_index: a.ix,
                        address_n: a.path
                    }
                })
            }) : null
        }, j.prototype._selectUtxos = function(a, b) {
            var c, d = this,
                e = [],
                f = 0,
                g = a.slice();
            for (g.sort(function(a, b) {
                    var c = d._wallet.txs[a.transactionHash],
                        e = d._wallet.txs[b.transactionHash],
                        f = c.block - e.block,
                        g = a.value - b.value;
                    return null == c.block && null != e.block && (f = 1), null != c.block && null == e.block && (f = -1), 0 !== f ? f : g
                }), c = 0; c < g.length && b > f; c++) g[c].value >= l && (e.push(g[c]), f += g[c].value);
            return f >= b ? e : void 0
        }, j.prototype.isLoading = function() {
            return null === this.balance
        }, j.prototype.subscribe = function() {
            var a = this;
            return this._deferred = h.defer(), this._backend.connect().then(function() {
                a._backend.subscribe(a.node, a._processBalanceDetailsUpdate.bind(a)).catch(function(b) {
                    a._deferred.reject(b)
                })
            }, function(b) {
                a._deferred.reject(b)
            }), f(function() {
                a.isLoading() && (a.subscribingIsSlow = !0)
            }, 3e4), this._deferred.promise
        }, j.prototype.unsubscribe = function() {
            return this._backend.unsubscribe(this.node), this._deferred = null, h.when()
        }, j.prototype._processBalanceDetailsUpdate = function(a) {
            g.log("[account] Received", a.status, "balance update for", this.label()), "PENDING" !== a.status && (this.utxos = this._constructUtxos(a, this.node.path), this.balance = this._constructBalance(a), this.transactions = null, this._backend.transactions(this.node).then(this._processTransactionsUpdate.bind(this)))
        }, j.prototype._processTransactionsUpdate = function(a) {
            g.log("[account] Received txs update for", this.label()), this.transactions = this._constructTransactions(a, this.node.path), this.transactions.forEach(function(a) {
                this._indexTx(a, this._wallet)
            }.bind(this)), this.transactions.forEach(function(a) {
                a.analysis = this._analyzeTx(a, this._wallet)
            }.bind(this)), this.transactions = this._balanceTxs(this.transactions), this._incrementOffsets(this.transactions), this._deferred.resolve()
        }, j.prototype._constructUtxos = function(a, b) {
            return ["confirmed", "change", "receiving"].map(function(c) {
                return a[c].map(function(a) {
                    return a.state = c, a.keyPathForAddress && (a.path = b.concat(a.keyPathForAddress)), a
                })
            }).reduce(function(a, b) {
                return a.concat(b)
            })
        }, j.prototype._constructBalance = function(a) {
            return ["confirmed", "change", "receiving"].map(function(b) {
                return a[b]
            }).reduce(function(a, b) {
                return a.concat(b)
            }).reduce(function(a, b) {
                return a + b.value
            }, 0)
        }, j.prototype._constructTransactions = function(a, c) {
            function f(a) {
                var b = new e.Transaction;
                return b.hash = a.hash, b.version = a.version, b.locktime = a.lockTime, b.blocktime = new Date(a.blockTime), b.block = a.height, b.ins = a.inputs.map(g), b.outs = a.outputs.map(h), b
            }

            function g(a) {
                var c = b.base64ToBytes(a.script),
                    d = e.Script.fromBuffer(c);
                return {
                    script: d,
                    hash: a.sourceHash,
                    index: a.ix,
                    sequence: a.sequence
                }
            }

            function h(a) {
                var c, d = b.base64ToBytes(a.script),
                    f = e.Script.fromBuffer(d);
                try {
                    c = e.Address.fromOutputScript(f, j)
                } catch (g) {
                    c = null, console.warn("[account] Failed to parse address from output script", g)
                }
                return {
                    script: f,
                    address: c,
                    value: a.value,
                    index: a.ix,
                    path: i(a)
                }
            }

            function i(a) {
                return a.keyPathForAddress ? c.concat(a.keyPathForAddress) : null
            }
            var j = this.network;
            return d.uniq(a.map(f), "hash")
        }, j.prototype._indexTx = function(a, b) {
            b.txs[a.hash] = a, a.outs.forEach(function(c, d) {
                var e = a.hash + ":" + d;
                b.outputs[e] = c
            })
        }, j.prototype._analyzeTx = function(a, b) {
            var c = (this.network, {
                    credit: 0,
                    debit: 0
                }),
                e = {
                    amount: 0,
                    outputs: [],
                    type: null
                };
            return a.ins.forEach(function(a) {
                var d = a.hash + ":" + a.index,
                    f = b.outputs[d];
                f && f.path && (e.amount -= f.value, c.debit++)
            }), a.outs.forEach(function(a) {
                a.path && (e.amount += a.value, c.credit++)
            }), e.type = c.debit === a.ins.length && c.credit === a.outs.length ? "self" : e.amount > 0 ? "recv" : "sent", a.outs.forEach(function(a) {
                a.address && ("recv" === e.type && a.path || "sent" === e.type && !a.path) && e.outputs.push(a)
            }), e.outputs.length > 1 && (e.outputs = e.outputs.filter(function(a) {
                return a.path ? 1 !== a.path[a.path.length - 2] : !0
            }), e.outputs = d.uniq(e.outputs, function(a) {
                return a.address.toString()
            })), e
        }, j.prototype._balanceTxs = function(a) {
            return a = d.sortBy(a, function(a) {
                var b = ["recv", "sent"];
                return [a.block || Number.MIN_VALUE, b.indexOf(a.analysis.type)]
            }), a.reduce(function(a, b) {
                return b.analysis ? (b.analysis.balance = (a ? a.analysis.balance : 0) + b.analysis.amount, b) : a
            }, null), a.reverse(), a
        }, j.prototype._incrementOffsets = function(a) {
            var b = this;
            a.forEach(function(a) {
                a.outs.filter(function(a) {
                    return a.path
                }).forEach(function(c) {
                    var d, e = c.path[c.path.length - 1],
                        f = c.path[c.path.length - 2];
                    if (0 === f) d = b._externalNode;
                    else {
                        if (1 !== f) return void g.warn("[account] Tx with unknown branch", a);
                        d = b._changeNode
                    }
                    a.block ? e >= (d.offset || 0) && (d.offset = e + 1) : e >= (d.unconfirmedOffset || 0) && (d.unconfirmedOffset = e + 1)
                })
            })
        }, j
    }]), angular.module("webwalletApp").factory("uriRedirect", ["deviceList", "$route", "$location", function(a, b, c) {
        "use strict";

        function d(a) {
            var b, c, d, e = {},
                f = a.match(/bitcoin:(\w+)\??(.*)/);
            if (!f) throw new Error("Invalid bitcoin URI");
            return b = f[1], c = f[2], c && (d = c.indexOf("&") ? c.split("&") : [c], d.forEach(function(a) {
                var b;
                a.indexOf("=") && (b = a.split("="), e[b[0]] = decodeURI(b[1]))
            })), {
                address: b,
                amount: parseFloat(e.amount) || null,
                label: e.label || null,
                message: e.message || null,
                params: e || null
            }
        }
        var e, f, g, h, i = ["/device/", null, "/account/", null, "/send/", null],
            j = ["/amount/", null];
        return (e = a.getDefault()) ? (f = e.getDefaultAccount()) ? (g = d(b.current.params.uri), i[1] = e.id, i[3] = f.id, i[5] = g.address, h = i.join(""), g.amount && (j[1] = g.amount, h += j.join("")), console.log("[uri] redirecting to " + h), c.path(h).replace(), null) : (console.warn("[uri] Failed to find default account.  No redirect to Send will be made."), void c.path("/")) : (console.warn("[uri] Failed to find default device.  No redirect to Send will be made."), void c.path("/"))
    }]), angular.module("webwalletApp").service("modalOpener", ["$rootScope", "$timeout", "selecter", "$document", "$modal", function(a, b, c, d, e) {
        "use strict";

        function f() {
            $(document).unbind("keydown.modalOpener").bind("keydown.modalOpener", function(a) {
                var b = !1;
                if (8 === a.keyCode) {
                    var c = a.srcElement || a.target;
                    b = "INPUT" === c.tagName.toUpperCase() && ("TEXT" === c.type.toUpperCase() || "PASSWORD" === c.type.toUpperCase() || "FILE" === c.type.toUpperCase() || "EMAIL" === c.type.toUpperCase() || "SEARCH" === c.type.toUpperCase() || "DATE" === c.type.toUpperCase()) || "TEXTAREA" === c.tagName.toUpperCase() ? c.readOnly || c.disabled : !0
                }
                b && a.preventDefault()
            })
        }

        function g() {
            $(document).unbind("keydown.modalOpener").bind("keydown.modalOpener", function() {})
        }
        this.currentlyOpenedModal = null, this.isModalOpened = function() {
            return null != this.currentlyOpenedModal
        }, this.openModal = function(a, f, g, h, i, j) {
            var k = f.replace(".", "-", "g") + "modal";
            "undefined" == typeof h && (h = {}), "undefined" == typeof i && (i = !1), a = angular.extend(a.$new(), h);
            var l = e.open({
                    templateUrl: "views/modal/" + f + ".html",
                    backdrop: "static",
                    keyboard: !1,
                    scope: a,
                    size: g,
                    windowClass: k
                }),
                m = this;
            return l.opened.then(function() {
                m.currentlyOpenedModal = l, a.$emit("modal." + f + ".show", j), b(function() {}, 1).then(function() {
                    angular.element("input[autofocus]").trigger("focus")
                }).then(function() {
                    a.autoselect = function() {
                        var a = d.find(".autoselect");
                        a.length && c.selectRange(a[0])
                    }, a.autoselect()
                })
            }), l.result.finally(function() {
                m.currentlyOpenedModal = null, a.$emit("modal." + f + ".hide", j)
            }), i || this.stopBackpaceOnModal(l), {
                result: l.result,
                modal: l,
                scope: a
            }
        }, this.stopBackpaceOnModal = function(a) {
            a.opened.then(function() {
                f()
            }), a.result.finally(function() {
                g()
            })
        }
    }]), angular.module("webwalletApp").service("pinModalService", ["$rootScope", "$document", "modalOpener", "$modal", function(a, b, c) {
        "use strict";
        this.openedModal = null, this.closeOpen = function() {
            null != this.openedModal && this.openedModal.modal.close(), this.openedModal = null
        }, this.showModal = function(a, d, e, f, g) {
            function h(a) {
                var b, c = a.which;
                return 8 === c ? (k.scope.delPin(), k.scope.$digest(), !1) : 13 === c ? (k.modal.close(k.scope.pin), !1) : void(i(c) && (b = j(c), k.scope.addPin(String.fromCharCode(b)), k.scope.$digest()))
            }

            function i(a) {
                return a >= 49 && 57 >= a || a >= 97 && 105 >= a
            }

            function j(a) {
                return a >= 97 ? a - 48 : a
            }
            if (e.id === a.device.id) {
                var k = c.openModal(a, "pin", "sm", {
                    pin: "",
                    type: f
                }, !0);
                this.openedModal = k, k.scope.addPin = function(a) {
                    k.scope.pin = k.scope.pin + a.toString(), b.focus()
                }, k.scope.delPin = function() {
                    k.scope.pin = k.scope.pin.slice(0, -1)
                }, k.scope.isPinSet = function() {
                    return k.scope.pin.length > 0
                }, b.on("keydown", h), b.focus(), k.result.then(function(a) {
                    b.off("keydown", h), g(null, a)
                }, function(a) {
                    b.off("keydown", h), g(a)
                })
            }
        }
    }]), angular.module("webwalletApp").service("passphraseModalService", ["$rootScope", "$document", "modalOpener", "forgetModalService", "$modal", function(a, b, c, d) {
        "use strict";
        this.openedModal = null, this.closeOpen = function() {
            null != this.openedModal && this.openedModal.modal.close(), this.openedModal = null
        }, this.showModal = function(a, b, e, f) {
            function g() {
                var a = j.scope.values;
                return j.scope.check ? void(j.scope.checkCorrect = a.passphrase === a.passphraseCheck && a.passphrase.length <= 50) : void(j.scope.checkCorrect = !0)
            }

            function h() {
                function a() {
                    return j.modal.close(j.scope.values.passphrase), !1
                }
                var b = document.getElementById("passphrase-submit"),
                    c = document.getElementById("passphrase-form");
                b.addEventListener("submit", a, !1), b.addEventListener("click", a, !1), c.addEventListener("submit", a, !1), c.addEventListener("keypress", function(b) {
                    13 === b.keyCode && j.scope.checkCorrect && a()
                }, !0)
            }
            if (e.id === a.device.id) {
                d.closeOpen(e);
                var i = a.device.hasSavedPassphrase();
                i || (e.forgetOnDisconnect = !0);
                var j = c.openModal(a, "passphrase", "sm", {
                    check: !i,
                    checkCorrect: !1,
                    values: {
                        passphrase: "",
                        passphraseCheck: ""
                    },
                    installHandler: h
                });
                this.openedModal = j, j.result.then(function(b) {
                    a.device.checkPassphraseAndSave(b) ? f(null, b) : f(new Error("Invalid passphrase")), i || (e.forgetOnDisconnect = null)
                }, function(a) {
                    f(a)
                }), j.scope.$watch("values.passphrase", g), j.scope.$watch("values.passphraseCheck", g)
            }
        }
    }]), angular.module("webwalletApp").service("forgetModalService", ["$rootScope", "modalOpener", "$modal", function(a, b) {
        "use strict";
        this.openModal = null, this.closeOpen = function(a) {
            null != this.openModal && this.openModal.modal.close(this.openModal.device.id !== a.id ? "force-other" : "force-same"), this.openModal = null
        }, this.showDisconnectedModal = function(a, c, d) {
            var e = !0;
            if (null != this.openModal && c.id === this.openModal.device.id && "requested" === this.openModal.type && (e = !1), this.closeOpen(c), e) {
                var f = b.openModal(a, "forget.disconnected", "md", {
                    device: c
                });
                this.openModal = {
                    modal: f.modal,
                    device: c,
                    type: "disconnected"
                }, f.modal.result.then(function(a) {
                    "force-other" === a || "force-same" === a || ("remember" === a ? (c.forgetOnDisconnect = !1, d.moveToLocal(c)) : "forget" === a && (c.forgetOnDisconnect = !0, d.forget(c)))
                })
            }
        }, this.showRequestedModal = function(a, c, d) {
            this.closeOpen(c);
            var e = b.openModal(a, "forget.requested", "md", {
                device: c
            });
            this.openModal = {
                modal: e.modal,
                device: c,
                type: "requested"
            };
            var f = this;
            e.modal.result.then(function(a) {
                ("forget" === a || "force-same" === a) && (c.forgetOnDisconnect = !0, d.forget(c)), f.openModal = null
            })
        }
    }]), angular.module("webwalletApp").service("setupModalService", ["$rootScope", "modalOpener", "$modal", function(a, b, c) {
        "use strict";
        this.openedModal = null, this.closeOpen = function() {
            null != this.openedModal && this.openedModal.close(), this.openedModal = null
        }, this.showModal = function(a) {
            this.openedModal = c.open({
                templateUrl: "views/modal/setup.html",
                size: "lg",
                windowClass: "buttonmodal",
                backdrop: "static",
                keyboard: !1,
                scope: a
            }), b.stopBackpaceOnModal(this.openedModal)
        }
    }]), angular.module("webwalletApp").service("currencyConverter", ["$http", function(a) {
        "use strict";
        var b = "https://bitpay.com/api/rates";
        this.getConversionRatePromise = function(a) {
            if (null == a) throw new Error("Null is not a currency");
            return this._getCurrenciesPromise().then(function(b) {
                return b.rates[a]
            })
        }, this.refreshRates = function() {
            this._currenciesPromise = null
        }, this._getCurrenciesPromise = function() {
            return null == this._currenciesPromise && (this._currenciesPromise = a.get(b).then(function(a) {
                var b = {},
                    c = [];
                return console.log("[currencyConverter]", a), a.data.forEach(function(a) {
                    "BTC" !== a.code && (b[a.code] = a.rate, c.push(a.code))
                }), {
                    list: c,
                    rates: b
                }
            })), this._currenciesPromise
        }, this.supportedFiatCurrencies = this._getCurrenciesPromise().then(function(a) {
            return a.list
        }), this.isSupportedCurrency = function(a) {
            return this._getCurrenciesPromise().then(function(b) {
                return null != b.rates[a]
            })
        }
    }]), angular.module("webwalletApp").service("sendConvertHelper", function() {
        "use strict";
        this.convertOutputsToAccountOutputs = function(a, b, c) {
            var d = [],
                e = [];
            return b.forEach(function(b) {
                var f;
                try {
                    f = b.convertToAccountOutput(a, c)
                } catch (g) {
                    e.push({
                        output: b,
                        error: g
                    })
                }
                null != f && d.push(f)
            }), 0 === e.length ? {
                ok: !0,
                accountOutputs: d
            } : {
                ok: !1,
                errors: e
            }
        }
    }), angular.module("webwalletApp").service("sendCountMaxHelper", ["$q", "utils", "config", function(a, b, c) {
        "use strict";

        function d(a, b) {
            var c = a.reduce(function(a, b) {
                    return a + b.value
                }, 0),
                d = b.reduce(function(a, b) {
                    return a + b.amount
                }, 0);
            return c - d
        }
        this.countMax = function(b, e, f, g, h, i) {
            return b.then(function(b) {
                function h(b) {
                    console.log("[sendCountMaxHelper] trying max fee", b, "restAmount-fee", j - b);
                    var c;
                    try {
                        c = g.buildTxOutput(f, j - b)
                    } catch (d) {
                        return console.log("[sendCountMaxHelper] Catched error", d.message), a.when(j)
                    }
                    var l = e.concat(c);
                    return a(function(a) {
                        var c = g.buildTx(l, i);
                        c.then(function(c) {
                            console.log("[send] max fee attempt", c, "suceeded", b), a(b)
                        }, function() {
                            console.log("[send] max fee failed, trying bigger", b), h(b + k).then(a)
                        })
                    })
                }
                var j = d(b, e),
                    k = c.feePerKb;
                return i && (k = 5 * k), k > j ? a.when(0) : h(k).then(function(a) {
                    return j - a
                })
            })
        }
    }]), angular.module("webwalletApp").factory("SendOutput", ["currencyConverter", "utils", "$timeout", "TrezorAccount", function(a, b, c, d) {
        "use strict";

        function e(a) {
            this.message = a
        }

        function f(a) {
            this.address = a.address, this.amount = a.amount, this.currencyFiat = a.currencyFiat || f.DEFAULT_ALT_CURRENCY, this.amountFiat = "", this.amountError = "", this.addressError = "", this.convertToFiat()
        }
        return f.DEFAULT_ALT_CURRENCY = "USD", f.fromAmountAddress = function(a, b) {
            return new f({
                amount: a,
                address: b
            })
        }, f.empty = function() {
            return new f({})
        }, f.prototype.toJSON = function() {
            return {
                address: this.address,
                amount: this.amount,
                currencyFiat: this.currencyFiat
            }
        }, f.prototype.convertToFiat = function() {
            if (this.currencyFiat) {
                if (!a.isSupportedCurrency(this.currencyFiat)) throw new Error("Unsupported currency");
                var b = +this.amount;
                b ? a.getConversionRatePromise(this.currencyFiat).then(function(a) {
                    this.amountFiat = Math.round10(b * a, -2).toString()
                }.bind(this), function(a) {
                    this.amountFiat = "", console.error(a)
                }.bind(this)) : this.amountFiat = ""
            }
        }, f.prototype.convertToBtc = function() {
            if (this.currencyFiat) {
                if (!a.isSupportedCurrency(this.currencyFiat)) throw new Error("Unsupported currency");
                var b = +this.amountFiat;
                b ? a.getConversionRatePromise(this.currencyFiat).then(function(a) {
                    this.amount = Math.round10(b / a, -5).toString()
                }.bind(this), function(a) {
                    this.amount = "", console.error(a)
                }.bind(this)) : this.amount = ""
            }
        }, f.prototype.convertToAccountOutput = function(a, c) {
            var d = c ? c : this.address,
                f = this.amount;
            if (!f) return null;
            var g;
            try {
                console.log("[SendOutput] trying to convert ", f), g = b.str2amount(f)
            } catch (h) {
                throw new e(h.message)
            }
            return d ? a.buildTxOutput(d, g) : null
        }, f.prototype._displayError = function(a, b) {
            var c;
            if ("address" === b) c = "addressError";
            else {
                if ("amount" !== b) throw new Error("Unknown error type");
                c = "amountError"
            }
            this[c] = a, console.warn("[SendOutput]", c, a)
        }, f.prototype.clearErrors = function() {
            this.amountError = null, this.addressError = null
        }, f.prototype.displayError = function(a) {
            a instanceof e ? this._displayError(a.message, "amount") : a.field === d.FIELD_ADDRESS ? this._displayError(a.message, "address") : a.field === d.FIELD_AMOUNT ? this._displayError(a.message, "amount") : this._displayError(a.message, "address")
        }, f.prototype.isEmpty = function() {
            return !this.address && !this.amount
        }, f
    }]), angular.module("webwalletApp").service("sendStorageHelper", ["$routeParams", "temporaryStorage", "SendOutput", function(a, b, c) {
        "use strict";

        function d() {
            if (b[e]) {
                var a = JSON.parse(b[e]);
                return a.outputs = a.outputs.map(function(a) {
                    return new c(a)
                }), a
            }
            return null
        }
        var e = "trezorSendValues";
        this.loadOutputs = function(b) {
            if (a.output) {
                var e = a.output,
                    f = null;
                a.amount && (f = a.amount), b.outputs = [c.fromAmountAddress(f, e)]
            } else {
                var g = d();
                b.outputs = null !== g ? g.outputs : [c.empty()], console.log("[send] init outputs done")
            }
        }, this.saveOutputs = function(a) {
            var c = {
                outputs: a.outputs
            };
            b[e] = JSON.stringify(c)
        }, this.cleanStorage = function() {
            delete b[e]
        }
    }]), angular.module("webwalletApp").service("sendTxHelper", ["$q", "$timeout", "utils", "sendCountMaxHelper", "sendConvertHelper", function(a, b, c, d, e) {
        "use strict";

        function f(b, c, d) {
            return h(b), d.ok ? 0 === d.accountOutputs.length ? (k("", b), a.when(0)) : j(d.accountOutputs, c, b) : (i(b, d.errors), a.when(0))
        }

        function g(a, b, c, d) {
            var f = b.outputs;
            return null != c && (f = f.filter(function(a) {
                return a !== c
            })), e.convertOutputsToAccountOutputs(a, f, d)
        }

        function h(a) {
            a.outputs.forEach(function(a) {
                a.clearErrors()
            }), a.error = ""
        }

        function i(a, b) {
            k(null, a), b.forEach(function(a) {
                console.log("[sendTxHelper] Displaying error."), a.output.displayError(a.error)
            }), a.error = "Some fields are incorrect."
        }

        function j(b, c, d) {
            return k(null, d), b ? c.buildTx(b, d.higherFees).then(function(a) {
                d.prepared = a, d.error = null
            }, function(a) {
                k(a, d)
            }) : a.reject("No outputs")
        }

        function k(a, b) {
            b.prepared = null, b.maxOutputCounting = !1, a && (b.error = "string" == typeof a ? a : a.message || "Failed to prepare transaction.")
        }
        this.prepareTx = function(a, b, c) {
            return c.prepared = null, c.prepareWorking = !0, this._waitForLoaded(a).then(function() {
                var b = (c.outputs, g(a, c));
                return f(c, a, b).then(function() {
                    c.prepareWorking = !1
                })
            })
        }, this._waitForLoaded = function(c) {
            return c.isLoading() ? b(function() {
                return this._waitForLoaded(c)
            }.bind(this), 100) : a.when(c)
        }, this.countAndSetMax = function(a, b, e, f) {
            a.maxCounting = !0, this._waitForLoaded(b).then(function() {
                var j = b.address(0).address,
                    k = g(b, f, a, j);
                if (k.ok) {
                    var l = d.countMax(b.findUnspents(), k.accountOutputs, j, b, e, f.higherFees);
                    l.then(function(b) {
                        a.maxCounting = !1, a.amount = c.amount2str(b), a.convertToFiat()
                    })
                } else a.maxCounting = !1, h(f), i(f, k.errors)
            })
        }
    }]), angular.module("webwalletApp").factory("flash", ["$rootScope", "$timeout", "$interpolate", function(a, b, c) {
        "use strict";

        function d() {
            b.cancel(h), h = b(function() {
                i = []
            })
        }

        function e() {
            a.$emit("flash:message", i, d)
        }

        function f(a, b) {
            if (b) {
                if (b.template) return {
                    html: c(b.template)(b),
                    level: a
                }
            } else b = a, a = "success";
            return {
                level: a,
                text: b
            }
        }

        function g(a, b) {
            return a instanceof Array ? a.map(function(a) {
                return a.level || a.text ? f(a.level, a.text) : f(a)
            }) : [f(a, b)]
        }
        var h, i = [];
        a.$on("$locationChangeSuccess", e);
        var j = function(a, b) {
            i = g(a, b), e(i)
        };
        return ["error", "warning", "info", "success"].forEach(function(a) {
            j[a] = function(b) {
                j(a, b)
            }
        }), j.clear = function() {
            e(null)
        }, j
    }]).directive("flashMessages", function() {
        return {
            controller: ["$scope", "$rootScope", function(a, b) {
                b.$on("flash:message", function(b, c, d) {
                    a.messages = c, d()
                })
            }],
            restrict: "EA",
            replace: !0,
            template: "<span ng-transclude></span>",
            transclude: !0
        }
    }), angular.module("webwalletApp").value("qrcode", window.qrcode), angular.module("webwalletApp").directive("qrScan", ["$interval", "qrcode", function(a, b) {
        return window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL, navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia, {
            restrict: "E",
            scope: {
                success: "&success",
                error: "&error"
            },
            link: function(c, d, e) {
                function f(b) {
                    j.src = window.URL && window.URL.createObjectURL(b) || b, j.play(), l = b, m = a(g, 500)
                }

                function g() {
                    if (l) {
                        n.drawImage(j, 0, 0, i, h);
                        try {
                            b.decode()
                        } catch (a) {
                            c.error({
                                error: a
                            })
                        }
                    }
                }
                var h = e.height || 300,
                    i = e.width || 250,
                    j = document.createElement("video");
                j.setAttribute("width", i), j.setAttribute("height", h);
                var k = document.createElement("canvas");
                k.setAttribute("id", "qr-canvas"), k.setAttribute("width", i), k.setAttribute("height", h), k.setAttribute("style", "display: none;"), angular.element(d).append(j), angular.element(d).append(k);
                var l, m, n = k.getContext("2d");
                c.$on("$destroy", function() {
                    m && (a.cancel(m), m = null), l && (l.stop(), l = null), b.callback = null
                }), b.callback = function(a) {
                    c.success({
                        data: a
                    })
                }, navigator.getUserMedia ? navigator.getUserMedia({
                    video: !0
                }, f, function(a) {
                    c.error({
                        error: a
                    })
                }) : c.error({
                    error: "Native web camera streaming is not supported in this browser."
                })
            }
        }
    }]), angular.module("webwalletApp").directive("focus", function() {
        return function(a, b) {
            b[0].focus()
        }
    }), angular.module("webwalletApp").controller("DebugCtrl", ["trezor", "trezorApi", "$rootScope", "$scope", "deviceList", function(a, b, c, d, e) {
        "use strict";

        function f() {
            return (window.console.logs || []).map(JSON.stringify).join("\n")
        }
        c.debug = {}, c.debug.toggle = function() {
            return c.debug.visible ? void(c.debug.visible = !1) : (c.debug.logs = f(), void(c.debug.visible = !0))
        }, c.debug.focus = function(a) {
            $(a.target).select()
        }, d.transportType = a instanceof b.HttpTransport ? "bridge" : a instanceof b.ChromeExtensionTransport ? "extension" : "plugin", c.deviceDetails = {}, c.deviceDetails.toggle = function() {
            return c.deviceDetails.visible ? void(c.deviceDetails.visible = !1) : void(c.deviceDetails.visible = !0)
        }, d.devices = function() {
            return e.all()
        }
    }]), angular.module("webwalletApp").value("bowser", window.bowser), angular.module("webwalletApp").controller("ErrorCtrl", ["config", "trezor", "trezorApi", "trezorError", "bowser", "udevError", "$scope", function(a, b, c, d, e, f, g) {
        "use strict";

        function h() {
            var a = navigator.userAgent;
            return a.match(/Win/) ? {
                name: "Windows"
            } : a.match(/Mac/) ? {
                name: "OS X"
            } : a.match(/Linux/) ? {
                name: "Linux"
            } : null
        }
        g.udevError = f, g.installChromeExtension = function(a) {
            if (window.chrome) {
                var b = "https://chrome.google.com/webstore/detail/" + a;
                window.chrome.webstore.install(b, function() {
                    window.location.reload()
                }, function(a) {
                    "Invalid manifest" === a && alert("You are using an outdated version of Google Chrome. Please upgrade or install TREZOR Bridge."), console.error(a)
                })
            }
        };
        try {
            g.installers = c.installers(), g.installers.forEach(function(a) {
                a.preferred && (g.selectedInstaller = a)
            }), g.udevInstallers = c.udevInstallers(), g.udevInstallers.forEach(function(a) {
                a.preferred && (g.selectedUdevInstaller = a)
            }), g.browser = e, g.platform = h(), g.chromeExtension = {
                id: a.extensionId
            }
        } catch (i) {
            d = d || i, console.error("[ErrorCtrl] Error occured while rendering the error view."), console.error(i.message)
        }
        null === d ? (g.error = !1, b instanceof c.PluginTransport && (g.deprecatePlugin = a.deprecatePlugin, g.usingPluginTransport = !0)) : (g.error = !0, g.errorMessage = d.message, g.installed = d.installed !== !1)
    }]), angular.module("webwalletApp").controller("MainCtrl", ["$scope", "deviceList", "deviceService", "udevError", "firmwareService", function(a, b, c, d) {
        "use strict";
        if (a.isConnected = function() {
                return b.all().some(function(a) {
                    return a.isConnected()
                })
            }, a.isEmpty = function() {
                return 0 === b.count()
            }, !a.isEmpty() && !a.isConnected()) {
            var e = b.all()[0];
            b.navigateToFirstAccount(e)
        }
        a.udevError = d
    }]), angular.module("webwalletApp").controller("NavCtrl", ["$scope", "$location", "deviceList", "modalOpener", "forgetModalService", "flash", function(a, b, c, d, e, f) {
        "use strict";
        a.devices = function() {
            return c.all()
        }, a.isActive = function(a) {
            return b.path().match(a)
        }, a.addingInProgress = !1, a.addAccount = function(c) {
            a.addingInProgress = !0, c.addAccount().then(function(d) {
                b.path("/device/" + c.id + "/account/" + d.id), a.addingInProgress = !1
            }, function(b) {
                f.error(b.message || "Failed to add account."), a.addingInProgress = !1
            })
        }, a.accountLink = function(b, c) {
            var d = "#/device/" + b.id + "/account/" + c.id;
            return a.isActive("/receive$") && (d += "/receive"), a.isActive("/send$") && (d += "/send"), d
        }, a.forget = function(b) {
            e.showRequestedModal(a, b, c)
        }
    }]), angular.module("webwalletApp").controller("ImportCtrl", ["deviceList", "TrezorDevice", "TrezorAccount", "config", "utils", "$scope", "$log", function(a, b, c, d, e, f, g) {
        "use strict";

        function h() {
            return Math.random().toString(36).substr(2)
        }

        function i(a, b) {
            var d = a.defaultCoin();
            return (b.match(/[^\r\n]+/g) || []).map(function(a) {
                return a = a.split(":"), a = a[a.length - 1], a = a.trim(), a.match(/\w+/) ? a : null
            }).map(function(b, f) {
                var h, i;
                return h = e.xpub2node(b), h.path = a.accountPath(f, d), g.log("Importing account", h), i = new c(f, d, h), i.subscribe(), i
            })
        }
        f.coins = {
            Bitcoin: {
                address_type: 0,
                coin_name: "Bitcoin",
                coin_shortcut: "BTC",
                maxfee_kb: 1e4
            },
            Testnet: {
                address_type: 111,
                coin_name: "Testnet",
                coin_shortcut: "TEST",
                maxfee_kb: 1e7
            }
        }, f.settings = {
            id: h()
        }, f.importDevice = function() {
            var c, d = f.settings.id,
                e = f.settings.payload;
            console.log("[import] Importing device", d), c = new b({
                id: d
            }), c.features = {
                device_id: d,
                coins: f.coins,
                initialized: !0,
                imported: !0,
                major_version: 0,
                minor_version: 0,
                patch_version: 0,
                pin_protection: !1,
                passphrase_protection: !1,
                revision: "deadbeef",
                bootloader_hash: "deafbeef",
                vendor: "bitcointrezor.com"
            }, e && (c.accounts = i(c, e)), a.addTemp(c)
        }
    }]), angular.module("webwalletApp").controller("BackendInfoCtrl", ["$scope", "TrezorBackend", "config", function(a, b, c) {
        "use strict";
        var d = b.singletonByName(c.coin);
        a.isStreamError = function() {
            return d.isStreamError()
        }
    }]), angular.module("webwalletApp").controller("DeviceCtrl", ["$scope", "$location", "$routeParams", "$document", "flash", "TrezorDevice", "deviceList", "modalOpener", "forgetModalService", "setupModalService", "pinModalService", "passphraseModalService", "deviceService", function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
        "use strict";

        function n(b, c) {
            c.forgetOnDisconnect === !0 || c.isEmpty() ? g.forget(c) : null == c.forgetOnDisconnect && i.showDisconnectedModal(a, c, g), j.closeOpen(), k.closeOpen(), l.closeOpen()
        }

        function o(a, b) {
            var c = b.dev.forgetOnDisconnect;
            p(b.requireDisconnect, b.customText).then(function() {
                g.forget(b.dev, b.requireDisconnect)
            }, function() {
                b.dev.forgetOnDisconnect = c, m.forgetRequestCancelled()
            })
        }

        function p(b, c) {
            var d = h.openModal(a, "disconnect", "sm", {
                disableCancel: b,
                customText: c
            });
            return w = d.modal, d.result
        }

        function q() {
            w && w.close()
        }

        function r(b, c, d, e) {
            k.showModal(a, b, c, d, e)
        }

        function s(b, c, d) {
            l.showModal(a, b, c, d)
        }

        function t(b, c, d) {
            var e = ["ButtonRequest_ConfirmWord", "ButtonRequest_FirmwareCheck"];
            c.id === a.device.id && e.indexOf(d) < 0 && u(d)
        }

        function u(b) {
            var c = h.openModal(a, "button", v(b), {
                code: b
            }, void 0, b);
            a.device.once(f.EVENT_RECEIVE, function() {
                c.modal.close()
            }), a.device.once(f.EVENT_ERROR, function() {
                c.modal.close()
            })
        }

        function v(a) {
            return "ButtonRequest_Address" === a ? "md" : "lg"
        }
        var w = null;
        return a.device = g.get(c.deviceId), a.device ? (a.$on(f.EVENT_PREFIX + f.EVENT_PIN, r), a.$on(f.EVENT_PREFIX + f.EVENT_BUTTON, t), a.$on(f.EVENT_PREFIX + f.EVENT_PASSPHRASE, s), a.$on(m.EVENT_ASK_FORGET, n), a.$on(m.EVENT_ASK_DISCONNECT, o), a.$on(m.EVENT_CLOSE_DISCONNECT, q), a.shouldDisplayLoading = function() {
            return a.device.isLoading() && !a.device.isEmpty() && !h.isModalOpened() && (0 === a.device.accounts.length || a.device.initializingAccounts === !0)
        }, a.shouldDisplayNoAccounts = function() {
            var b = !a.device.isEmpty(),
                c = 0 === a.device.accounts.length,
                d = !a.device.isLoading();
            return b && c && d
        }, a.forgetDevice = function() {
            i.showRequestedModal(a, a.device, g)
        }, a.rememberDevice = function() {
            a.device.forgetOnDisconnect = !1, g.moveToLocal(a.device)
        }, void(a.dontRememberDevice = function() {
            a.device.forgetOnDisconnect = null, g.moveToTemp(a.device)
        })) : void b.path("/")
    }]), angular.module("webwalletApp").controller("DeviceInfoCtrl", ["flash", "$scope", "$rootScope", "$timeout", "$document", "selecter", "modalOpener", "deviceList", "$location", function(a, b, c, d, e, f, g, h) {
        "use strict";

        function i(a) {
            a.targetScope.changing = b._changing
        }

        function j() {
            return g.openModal(b, "label", "md", {
                label: b.device.features.label || ""
            }).result
        }
        b.activeXpub = null, b.activateXpub = function(a) {
            b.activeXpub = a, d(function() {
                var b = e.find(".xpub-in:contains(" + a + ")");
                b.length && f.selectRange(b[0])
            })
        }, b.learnMorePassDisplayed = !1, b.learnMorePass = function() {
            b.learnMorePassDisplayed = !0
        }, b.xpubDisplayed = !1, b.xpubDisplay = function() {
            b.xpubDisplayed = !0, b.activateXpub(b.device.accounts[0].publicKey())
        }, b.learnMoreXpubDisplayed = !1, b.learnMoreXpub = function() {
            b.learnMoreXpubDisplayed = !0
        }, b.$watch("device.accounts.length", function() {
            b.device.accounts.length > 0 && b.activateXpub(b.device.accounts[0].publicKey())
        }), b._changing = null, c.$on("modal.button.show", i), b.changePin = function(c) {
            b._changing = "pin";
            var d = c ? "removed" : "changed";
            b.device.changePin(c).then(function() {
                a.success("PIN was successfully " + d)
            }, function(b) {
                a.error(b.message || "PIN change failed")
            }).finally(function() {
                b._changing = null
            })
        }, b.togglePassphrase = function(c) {
            b._changing = "passphrase";
            var d = "Disconnect your Trezor to " + (c ? "enable" : "disable") + " passphrase.";
            b.device.togglePassphrase(c).then(function() {
                h.forget(b.device, !0, d)
            }, function(b) {
                a.error(b.message || "Passphrase toggle failed")
            }).finally(function() {
                b._changing = null
            })
        }, b.changeLabel = function() {
            j().then(function(a) {
                return a = a.trim() || b.device.DEFAULT_LABEL, b.device.changeLabel(a)
            }).then(function() {
                a.success("Label was successfully changed")
            }, function(b) {
                b && a.error(b.message || "Failed to change the device label")
            })
        }
    }]), angular.module("webwalletApp").controller("FirmwareCtrl", ["$modal", "$scope", "$rootScope", "$routeParams", "deviceList", "firmwareService", "modalOpener", "TrezorDevice", function(a, b, c, d, e, f, g, h) {
        "use strict";

        function i(a, b, c) {
            return b.required ? l(a, b, c) : j(a, b, c)
        }

        function j(a, b, d) {
            c.optionalFirmware = {
                device: a,
                firmware: b,
                version: d,
                update: function() {
                    l(a, b, d)
                }
            }
        }

        function k(a, b) {
            c.optionalFirmware && c.optionalFirmware.device.id === b.id && delete c.optionalFirmware
        }

        function l(a, b, c) {
            n(a, b, c, u)
        }

        function m(a, b) {
            n(a, b, void 0, x)
        }

        function n(b, d, h, i) {
            return s = angular.extend(c.$new(), {
                firmware: d,
                version: h,
                device: b,
                update: function() {
                    o(d)
                }
            }), q(i), f.setModalOpen(!0), r = a.open({
                templateUrl: "views/modal/firmware.html",
                size: "lg",
                backdrop: "static",
                keyboard: !1,
                scope: s
            }), g.stopBackpaceOnModal(r), r.result.then(function() {
                f.setModalOpen(!1)
            }, function() {
                f.setModalOpen(!1), d.required && e.forget(b, !0)
            }), r.result
        }

        function o(a) {
            function b(a, b, c) {
                c === h.REQ_BUTTON_FIRMWARE && q(C)
            }
            var d;
            s.firmware = a, q(y), f.download(a).then(function(a) {
                return d = c.$on(h.EVENT_PREFIX + h.EVENT_BUTTON, b), q(z), s.device.flash(a)
            }).then(function() {
                q(A), d()
            }, function(a) {
                q(B), s.error = a.message, d()
            })
        }

        function p(a, b) {
            return t === A || t === B || t === x ? (e.forget(b, !0), s.previousDevice && e.forget(s.previousDevice, !0), void r.close()) : t === u || t === w ? void q(v) : void q(u)
        }

        function q(a) {
            t = a, s && (s.state = a)
        }
        var r = null,
            s = null,
            t = null,
            u = "initial",
            v = "initial-disconnected",
            w = "device-normal",
            x = "device-bootloader",
            y = "update-downloading",
            z = "update-flashing",
            A = "update-success",
            B = "update-error",
            C = "update-check";
        b.$on(f.EVENT_CONNECT, k), b.$on(f.EVENT_DISCONNECT, k), b.$on(f.EVENT_DISCONNECT, k), b.$on(f.EVENT_DISCONNECT, p, 10), b.$on(f.EVENT_BOOTLOADER, function(a, b) {
            s && (s.previousDevice = s.device, s.device = b), q(x)
        }), b.$on(f.EVENT_NORMAL, function() {
            q(w)
        }), b.$on(f.EVENT_CANDIDATE, function(a, b) {
            m(b.dev, b.firmware)
        }), b.$on(f.EVENT_OUTDATED, function(a, b) {
            i(b.dev, b.firmware, b.version)
        })
    }]), angular.module("webwalletApp").controller("DeviceLoadCtrl", ["flash", "$scope", "$location", function(a, b, c) {
        "use strict";
        b.settings = {}, b.loadDevice = function() {
            var d = b.settings,
                e = b.device;
            d.label && (d.label = d.label.trim()), d.payload = d.payload.trim(), e.load(d).then(function() {
                c.path("/device/" + e.id + "/account/0")
            }, function(b) {
                a.error(b.message || "Importing failed")
            })
        }
    }]), angular.module("webwalletApp").controller("DeviceRecoveryCtrl", ["bip39", "flash", "$scope", "$location", function(a, b, c, d) {
        "use strict";

        function e(a, b, d) {
            b.id === c.device.id && (c.seedFocus = !0, c.seedWord = "", c.wordCallback = function(a) {
                c.seedFocus = !1, c.wordCallback = null, c.seedWord = "", d(null, a)
            })
        }
        c.recovering = !1, c.seedFocus = !1, c.seedWord = "", c.seedWords = null, c.seedWordlist = a.english, c.settings = {
            pin_protection: !0,
            word_count: 24
        }, c.$on("device.word", e), c.startsWith = function(a, b) {
            var c = a.substr(0, b.length).toLowerCase();
            return c === b.toLowerCase()
        }, c.recoverDevice = function() {
            c.settings.label && (c.settings.label = c.settings.label.trim()), c.settings.word_count = +c.settings.word_count, c.seedWords = [], b.clear(), c.recovering = !0, c.device.recover(c.settings).then(function() {
                c.recovering = !1, d.path("/device/" + c.device.id + "/account/0")
            }, function(a) {
                c.recovering = !1, b.error(a.message || "Recovery failed")
            })
        }, c.recoverWord = function() {
            c.seedWords.push(c.seedWord), c.wordCallback(c.seedWord)
        }
    }]), angular.module("webwalletApp").controller("DeviceSetupCtrl", ["utils", "flash", "$scope", "modalOpener", "deviceList", "deviceService", "setupModalService", "$modal", function(a, b, c, d, e, f, g) {
        "use strict";

        function h(a) {
            return (a + a / 32) / 11
        }

        function i() {
            g.closeOpen()
        }

        function j() {
            g.showModal(c)
        }
        c.advanced = !1, c.settings = {
            strength: 256,
            pin_protection: !0
        }, c.recoveryStarted = !1, c.recoveryWords = null, c.recoveryWordsDone = 0, c.recoveryCurrentWord = 1, c.$on("device.button", function(a, b, d) {
            b.id === c.device.id && "ButtonRequest_ConfirmWord" === d && c.setupRecoveryNext()
        }), c.setupDevice = function() {
            var d = c.settings,
                e = c.device;
            d.strength = +d.strength, d.label = d.label ? d.label.trim() || e.DEFAULT_LABEL : e.DEFAULT_LABEL, c.recoveryWords = h(d.strength), e.reset(d).then(function() {
                a.redirect("/device/" + e.id + "/account/0").then(function() {
                    b.success("Congratulations! Your device is now ready to use.")
                })
            }, function(a) {
                b.error(a.message || "Setup failed")
            })
        }, c.setupRecoveryNext = function() {
            return c.recoveryStarted ? (c.recoveryWordsDone = c.recoveryWordsDone + 1, c.recoveryCurrentWord = c.recoveryCurrentWord + 1, void(c.recoveryWordsDone < c.recoveryWords ? c.stage = "write" : c.recoveryWordsDone === c.recoveryWords ? (c.recoveryCurrentWord = 1, c.stage = "checkFirst") : c.recoveryWordsDone < 2 * c.recoveryWords - 1 ? c.stage = "check" : c.device.once("receive", function() {
                i()
            }))) : (c.recoveryStarted = !0, c.stage = "writeFirst", void j())
        }
    }]), angular.module("webwalletApp").controller("DeviceWipeCtrl", ["$scope", "$rootScope", "flash", "deviceList", "modalOpener", function(a, b, c, d, e) {
        "use strict";

        function f(a) {
            var b;
            i && (i = !1, b = null !== j, j && (j.close(), j = null), h(b).then(function() {
                d.forget(a)
            }, function() {
                d.navigateTo(a, !0)
            }), d.abortHook())
        }

        function g() {
            var b = e.openModal(a, "disconnect.wipe", "sm");
            return j = b.modal, b.result
        }

        function h(b) {
            return e.openModal(a, "forget.wipe", null, {
                hideSuccessMsg: b
            }).result
        }
        var i = !1,
            j = null;
        d.registerDisconnectHook(f, 10), a.wipeDevice = function() {
            i = !0, a.device.wipe().then(function() {
                g()
            }, function(a) {
                i = !1, c.error(a.message || "Wiping failed")
            })
        }
    }]), angular.module("webwalletApp").controller("AccountCtrl", ["$scope", "$location", "$routeParams", "config", function(a, b, c, d) {
        "use strict";
        return a.account = a.device.account(c.accountId), a.account || "0" === c.accountId ? (a.isInit = function() {
            var b = a.device.isLoading();
            return b ? (a.account = a.device.account(c.accountId), a.device.isConnected() ? !0 : !1) : !1
        }, a.blockExplorer = d.blockExplorers[d.coin], void(a.hideAccount = function() {
            a.account.unsubscribe(), a.device.hideAccount(a.account), b.path("/device/" + a.device.id + "/account/" + (a.device.accounts.length - 1))
        })) : void b.path("/")
    }]), angular.module("webwalletApp").controller("AccountReceiveCtrl", ["flash", "$document", "$rootScope", "$scope", "selecter", "$timeout", function(a, b, c, d, e, f) {
        "use strict";

        function g(a, c) {
            "ButtonRequest_Address" === c && (h(a.targetScope), f(function() {
                var a = d.activeAddress.address,
                    c = b.find(".address-modal .address-list-address:contains(" + a + ")");
                c.length && e.selectRange(c[0])
            }, 100))
        }

        function h(a) {
            a.address = d.activeAddress
        }
        d.activeAddress = null, d.usedAddresses = [], d.addresses = [], d.lookAhead = 20, d.enoughAddresses = function() {
            return d.addresses[d.addresses.length - 1].index >= d.account.maxLiveAddressIndex(d.lookAhead)
        }, d.activate = function(a) {
            d.activeAddress = a, f(function() {
                var c = a.address,
                    d = b.find(".address-list-address:contains(" + c + ")");
                d.length && e.selectRange(d[0])
            })
        }, d.verify = function(b) {
            b.verification = !0, d.device.verifyAddress(b.path, b.address).then(function(c) {
                b.verification = !1, c || a.error("Address verification failed! Please contact TREZOR support.")
            }, function(c) {
                b.verification = !1, a.error(c.message)
            })
        }, d.more = function() {
            var a = d.addresses.length,
                b = d.account.address(a);
            d.addresses[a] = b, d.activate(b)
        }, d.more(), c.$on("modal.button.show", g)
    }]), angular.module("webwalletApp").controller("AccountSendCtrl", ["temporaryStorage", "flash", "utils", "config", "deviceList", "$filter", "$scope", "$rootScope", "$routeParams", "$q", "$modal", "$log", "modalOpener", "currencyConverter", "sendStorageHelper", "sendTxHelper", "SendOutput", "$http", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) {
        "use strict";

        function r() {
            o.saveOutputs(g.tx), p.prepareTx(g.account, g.device, g.tx)
        }

        function s(a, b) {
            "ButtonRequest_ConfirmOutput" === b && t(a.targetScope, !0), "ButtonRequest_SignTx" === b && t(a.targetScope, !1)
        }

        function t(a, b) {
            var c = g.tx.prepared;
            a.account = g.account, a.tx = c, c && b && (c.outputs[g.outputIndex] && c.outputs[g.outputIndex].address_n && g.outputIndex++, c.outputs[g.outputIndex] && (a.output = c.outputs[g.outputIndex], g.outputIndex++))
        }

        function u() {
            return m.openModal(g, "qr", "lg").result
        }

        function v(a) {
            var b, c;
            return 0 === a.indexOf("bitcoin:") && (a = a.substring(8)), c = a.split("?"), b = c.length > 1 ? w(c[1]) : {}, b.address = c[0], b.address.length < 27 || b.address.length > 34 ? null : b
        }

        function w(a) {
            return a.split("&").map(function(a) {
                return a.split("=")
            }).reduce(function(a, b) {
                return b.length > 1 && (a[b[0]] = b[1]), a
            }, {})
        }

        function x(a) {
            var b, c, d, e, f, h, i, j;
            if (b = a.data.replace("\r", "\n").replace("\n\n", "\n"), !b) return "Please fill the CSV.";
            if (c = {
                    cellDelimiter: (a.delimiter || "")[0] || ",",
                    header: !!a.header,
                    lineDelimiter: "\n"
                }, e = new CSV(b, c).parse(), f = e.length, !f) return "Unable to parse the CSV.";
            c.header ? (i = "address", j = "amount") : (i = 0, j = 1);
            var k = [];
            for (h = 0; f > h; h += 1) {
                if (d = e[h], !d[i]) return "Address not found in the header.";
                if (!d[j]) return "Amount not found in the header.";
                var l = d[i].toString(),
                    m = d[j].toString();
                k.push(q.fromAmountAddress(m, l))
            }
            for (var n = g.tx.outputs.concat(k); n.length > 1 && n[0].isEmpty();) n.shift();
            return g.tx.outputs = n, null
        }
        g.fiatCurrencies = [], n.refreshRates(), n.supportedFiatCurrencies.then(function(a) {
            console.log("[send] supported currencies downloaded and set.", a), g.fiatCurrencies = a
        }), g.tx = {
            outputs: null,
            prepared: null,
            error: null,
            prepareWorking: !1,
            higherFees: !0
        }, g.sending = !1, o.loadOutputs(g.tx), g.$watch(function() {
            return null !== g.account.balance
        }, function(a) {
            a && r()
        }), g.$watch("tx.outputs", function(a, b) {
            a !== b && r()
        }, !0), g.$watch("tx.higherFees", function(a, b) {
            a !== b && r()
        }, !0), g.setMax = function(a) {
            p.countAndSetMax(a, g.account, g.device, g.tx)
        }, g.isChangeHapenning = function() {
            return g.tx.prepareWorking ? !0 : g.tx.outputs.some(function(a) {
                return a.maxCounting
            })
        }, g.send = function() {
            p.prepareTx(g.account, g.device, g.tx).then(function() {
                var a, e = g.tx.prepared;
                e && (g.sending = !0, g.outputIndex = 0, g.account.sendTx(e, g.device).then(function(e) {
                    o.cleanStorage(), g.sending = !1, a = ["/device/", g.device.id, "/account/", g.account.id].join(""), c.redirect(a).then(function() {
                        e.hashRev = e.hash.slice(), e.hashRev.reverse();
                        var a = c.bytesToHex(e.hashRev);
                        b.success({
                            template: ['Transaction <a href="{{url}}" target="_blank" ', 'title="Transaction info at {{title}}">{{hashHex}}</a> ', "was successfully sent."].join(""),
                            hashHex: a,
                            url: d.blockExplorers[d.coin].urlTx + a,
                            title: d.blockExplorers[d.coin].name
                        })
                    })
                }, function(a) {
                    return g.sending = !1, a.value && a.value.bytes ? void b.error({
                        template: ["Failed to send transaction: {{message}}.<br><br>", "Raw transaction in hex format:<br>", '<span class="text-monospace">{{bytes}}</span><br>', "You can try to resend this transaction using", '<a href="https://blockchain.info/pushtx" target="_blank">', "Blockchain.info's Broadcast Transaction tool</a>."].join("\n"),
                        bytes: c.bytesToHex(a.value.bytes),
                        message: a.message,
                        show_raw_tx: !1
                    }) : void b.error(["Failed to send transaction: ", a.message, "."].join(""))
                }))
            })
        }, g.removeOutput = function(a) {
            var b = g.tx.outputs.indexOf(a); - 1 !== b && g.tx.outputs.splice(b, 1), 0 === g.tx.outputs.length && g.addOutput()
        }, g.addOutput = function() {
            g.tx.outputs.push(q.empty())
        }, g.removeAllOutputs = function() {
            g.tx.outputs = [q.empty()]
        }, h.$on("modal.button.show", s), g.suggestAddresses = function() {
            var a = g.device,
                b = g.account,
                c = [],
                d = e.count() > 1;
            return e.all().forEach(function(d) {
                d.accounts.forEach(function(e) {
                    (d.id !== a.id || e.id !== b.id) && c.push([d, e])
                })
            }), c.map(function(a) {
                var b, c = a[0],
                    e = a[1],
                    f = e.address(0).address;
                return b = d ? c.label() + " / " + e.label() : e.label(), {
                    label: b + ": " + f,
                    address: f,
                    source: "Accounts"
                }
            })
        }, g.qr = {
            enabled: navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
        }, g.scanQr = function(a) {
            u().then(function(b) {
                var c = v(b);
                if (!c) throw new Error("Provided QR code does not contain valid address");
                c.address && (a.address = c.address), c.amount && (a.amount = c.amount)
            }, function(a) {
                a && b.error(a.message || "QR scanning failed")
            })
        }, g.promptCsv = function() {
            var a = m.openModal(g, "csv", "lg", {
                values: {
                    data: "",
                    delimiter: ",",
                    header: !1
                },
                submit: function(b) {
                    var c = x(b);
                    c ? g.errMsg = c : a.modal.close()
                }
            });
            return g.$on("qr.address", function() {
                a.modal.close()
            }), a.result
        }
    }]), angular.module("webwalletApp").controller("AccountSignCtrl", ["utils", "$q", "$scope", function(a, b, c) {
        "use strict";

        function d(a) {
            var b, d, e, f = c.usableAddresses();
            for (b = 0, d = f.length; d > b; b += 1)
                if (e = f[b], e.address === a) return e.path ? e.path : e.acc.getOutPath(e.tx);
            return null
        }
        c.signSaveAddress = function() {
            return c.sign.address ? (c.sign.address_n = d(c.sign.address), c.sign.address_n ? (c.sign.address_status = "success", !0) : (c.sign.address_status = "error", !1)) : (c.sign.address_n = null, c.sign.address_status = null, !1)
        }, c.sign = function() {
            var b, d, e;
            b = a.bytesToHex(a.stringToBytes(c.sign.message)), d = c.sign.address_n, e = c.device.defaultCoin(), c.device.signMessage(d, b, e).then(function(b) {
                c.sign.res = null, c.sign.signature = a.bytesToBase64(a.hexToBytes(b.message.signature))
            }, function(a) {
                c.sign.res = {
                    status: "error",
                    message: ["Failed to sign message: ", a.message, "."].join("")
                }
            })
        }, c.verify = function() {
            var b, d, e;
            if (b = a.bytesToHex(a.stringToBytes(c.verify.message)), d = c.verify.address, !d) return void(c.verify.res = {
                status: "error",
                message: ["Please fill the address."].join("")
            });
            try {
                e = a.bytesToHex(a.base64ToBytes(c.verify.signature))
            } catch (f) {
                return void(c.verify.res = {
                    status: "error",
                    message: "Failed to verify message: Invalid signature."
                })
            }
            c.device.verifyMessage(d, e, b).then(function() {
                c.verify.res = {
                    status: "success",
                    message: "Message verified."
                }
            }, function(a) {
                c.verify.res = {
                    status: "error",
                    message: ["Failed to verify message: ", a.message, "."].join("")
                }
            })
        };
        var e = !1,
            f = !1,
            g = function() {
                function a(a) {
                    return {
                        address: a.address,
                        path: a.path,
                        acc: c.account
                    }
                }
                var d = 20;
                return b(function(b) {
                    f = !0;
                    var e = [];
                    c.account.usedAddresses().concat(c.account.usedAddresses(!0)).map(a).forEach(function(a) {
                        e.push(a)
                    }), c.account.lazyUnusedAddresses(d).then(function(c) {
                        c.map(a).forEach(function(a) {
                            e.push(a)
                        }), b(e), f = !1
                    })
                })
            };
        c.isSignAddressLoading = function() {
            return f && null != c.sign.address && 0 !== c.sign.address.length
        };
        var h = [];
        c.usableAddresses = function() {
            return e || (console.log("derivation started"), e = !0, g().then(function(a) {
                h = a, c.resetSign(), c.signSaveAddress()
            })), h
        }, c.resetSign = function() {
            c.sign.signature = "", c.sign.res = null
        }, c.resetVerify = function() {
            c.verify.res = null
        }, c.isSignInputValid = function() {
            return c.sign.message && c.sign.address_n
        }, c.hasErrorMessage = function(a) {
            return c[a] && c[a].res && c[a].res.message
        }, c.getAlertClass = function(a) {
            if (c[a] && c[a].res) {
                if ("error" === c[a].res.status) return "alert-danger";
                if ("success" === c[a].res.status) return "alert-success"
            }
        }, c.getSignAddressClass = function() {
            return f ? void 0 : "error" === c.sign.address_status ? "has-error" : "success" === c.sign.address_status ? "has-success" : void 0
        }, c.isUnicode = function(a) {
            return "undefined" == typeof a ? !1 : a.split("").some(function(a) {
                return a.charCodeAt(0) > 127
            })
        }, c.nonAsciiCharacter = function(a) {
            if ("undefined" == typeof a) return "";
            var b = a.split("").filter(function(a) {
                return a.charCodeAt(0) > 127
            });
            return 0 == b.length ? "" : b[0]
        }
    }]), angular.module("webwalletApp").controller("ModalPinCtrl", ["$scope", "deviceService", "deviceList", function(a) {
        "use strict";
        a.ratePin = function(b) {
            var c = a.device.ratePin(b);
            return 0 === c ? "long" : 3e3 > c ? "weak" : 6e4 > c ? "fine" : 36e4 > c ? "strong" : "ultimate"
        }
    }]), angular.module("webwalletApp").run(["$templateCache", function(a) {
        "use strict";
        a.put("views/account/index.html", '<div ng-controller=DeviceCtrl><div ng-controller=AccountCtrl><div ng-if=isInit()><ng-include src="\'views/device/loading.jumbotron.html\'"></ng-include></div><div ng-if=shouldDisplayNoAccounts()><ng-include src="\'views/device/noaccounts.jumbotron.html\'"></ng-include></div><div ng-if=!(isInit()||shouldDisplayNoAccounts())><div class="alert alert-danger alert-inconsistent" ng-show=account.isInconsistent()><strong>Warning!</strong> Account balance information is inconsistent.</div><ng-include src="\'views/account/nav.html\'"></ng-include><div class=tab-content><table class="txlist table table-hover" ng-show="account.transactions != null && account.transactions.length"><thead><tr class=text-muted><th width=20%>Timestamp</th><th class=txlist-header-address>Address</th><th width=16% class=txlist-header-amount>Amount</th><th width=16% class=txlist-header-balance>Balance</th></tr></thead><tbody><tr class=txlist-tx ng-repeat="tx in account.transactions"><td class=txlist-date ng-if=tx.block><span title="{{ tx.blocktime  | date:\'yyyy-MM-dd HH:mm:ss\'}}">{{tx.blocktime | date:\'yyyy-MM-dd\'}}</span> <small class="text-muted visible-lg-inline">{{tx.blocktime | date:\'HH:mm:ss\'}}</small></td><td class="txlist-date text-center text-muted" ng-if=!tx.block><small title="Transaction received at {{tx.blocktime | date:\'yyyy-MM-dd HH:mm:ss\'}}">Unconfirmed</small></td><td class=txlist-comment ng-if=tx.comment>"{{tx.comment}}"</td><td class=txlist-address ng-if=!tx.comment ng-switch=tx.analysis.type><a href={{blockExplorer.urlTx}}{{tx.hash}} class=txlist-hash target=_blank title="Transaction info at {{blockExplorer.name}}"><span class="glyphicon glyphicon-info-sign"></span></a> <span class="txlist-address-text text-success" ng-switch-when=recv ng-repeat="output in tx.analysis.outputs"><span class="glyphicon glyphicon-circle-arrow-right" title=Received></span> {{output.address.toString()}}<br></span> <span class="txlist-address-text text-danger" ng-switch-when=sent ng-repeat="output in tx.analysis.outputs"><span class="glyphicon glyphicon-circle-arrow-left" title=Sent></span> {{output.address.toString()}}<br></span> <span class="txlist-address-text text-warning" ng-switch-when=self><span class="glyphicon glyphicon-user"></span> Sent to myself</span> <span class="txlist-address-text text-muted" ng-switch-default><span class="glyphicon glyphicon-question-sign"></span> Unknown</span></td><td class=txlist-amount ng-class="{ \'text-success\': tx.analysis.amount > 0,\n                            \'text-danger\': tx.analysis.amount < 0 }">{{tx.analysis.amount | amount:true}}</td><td class=txlist-balance>{{tx.analysis.balance | amount}}</td></tr></tbody></table><div class="txlist-empty text-center text-muted" ng-show="account.transactions != null && !account.transactions.length"><h4>No transactions to display</h4><button class="btn btn-default" ng-show=device.canHideAccount(account) ng-click=hideAccount()>Hide this account</button></div><div class="txlist-loading text-center text-muted" ng-show="account.transactions == null"><span class=icon-loading title="Loading transactions..."></span></div></div></div></div></div>'), a.put("views/account/nav.html", '<ul ng-controller=NavCtrl class="nav nav-tabs"><li ng-class="{ active: isActive(\'/device/{{device.id}}/account/{{account.id}}$\') }"><a class=btn href=#/device/{{device.id}}/account/{{account.id}}><span class="glyphicon glyphicon-transfer"></span> Transactions</a></li><li ng-class="{ active: isActive(\'/device/{{device.id}}/account/{{account.id}}/receive$\') }"><a class=btn href=#/device/{{device.id}}/account/{{account.id}}/receive><span class="glyphicon glyphicon-circle-arrow-right"></span> Receive</a></li><li ng-class="{ active: isActive(\'/device/{{device.id}}/account/{{account.id}}/send\') }"><a class=btn href=#/device/{{device.id}}/account/{{account.id}}/send><span class="glyphicon glyphicon-circle-arrow-left"></span> Send</a></li><li ng-class="{ active: isActive(\'/device/{{device.id}}/account/{{account.id}}/sign$\') }" class=nav-tab-small><a class=btn href=#/device/{{device.id}}/account/{{account.id}}/sign><span class="glyphicon glyphicon-envelope"></span> Sign & Verify</a></li></ul>'), a.put("views/account/receive.html", '<div ng-controller=DeviceCtrl><div ng-controller=AccountCtrl><div class="alert alert-danger alert-inconsistent" ng-show=account.isInconsistent()><strong>Warning!</strong> Account balance information is inconsistent.</div><ng-include src="\'views/account/nav.html\'"></ng-include><div class=tab-content><div ng-if="account.transactions === null" class="text-center text-muted"><h4>Waiting for transaction history&hellip;</h4></div><div ng-controller=AccountReceiveCtrl ng-if="account.transactions !== null" class=row><div class=col-md-8><button class="address-list-toggleused btn btn-sm btn-link pull-right" ng-show="!usedAddresses.length && account.transactions.length" ng-click="usedAddresses = account.usedAddresses()"><span class="glyphicon glyphicon-chevron-up"></span> Show previous</button> <button class="address-list-toggleused btn btn-sm btn-link pull-right" ng-show="usedAddresses.length && account.transactions.length" ng-click="usedAddresses = []"><span class="glyphicon glyphicon-chevron-down"></span> Hide previous</button><h5>Address</h5><div class="list-group address-list address-list-used" ng-show=usedAddresses.length><span class="list-group-item address-list-item" ng-repeat="address in usedAddresses" ng-class="{ active: activeAddress.address === address.address }" ng-click=activate(address)><span class=address-list-index>/{{address.path[address.path.length-1]}}</span> <span class=address-list-address>{{address.address}}</span><div class="address-list-balance pull-right" ng-if=address.received>Total received<br><a href={{blockExplorer.urlAddress}}{{address.address}} target=_blank title="Address info at {{blockExplorer.name}}">{{address.received | amount}} {{account.coin.coin_shortcut}}</a></div><div class="address-list-balance pull-right" ng-if=!address.received>Unused address</div><span class=address-verify ng-if="\n                    device.supports(\'addressVerification\')\n                    " ng-class="{nonactive: (activeAddress.address !== address.address)}"><div ng-if=device.isConnected() ng-hide=address.verification><button class="btn btn-link btn-verifyaddress" ng-click=verify(address) tooltip="Show on TREZOR" tooltip-placement=bottom tooltip-append-to-body=1><span class="glyphicon glyphicon-eye-open"></span></button></div><div ng-if=!device.isConnected() tooltip="Connect your device to display this address" tooltip-placement=bottom tooltip-append-to-body=1><button class="btn btn-link btn-verifyaddress" disabled><span class="glyphicon glyphicon-eye-open"></span></button></div></span></span><hr></div><div class="list-group address-list"><div ng-repeat="address in addresses"><a class="list-group-item address-list-item" ng-class="{\n                 invalid: address.invalid,\n                 active: activeAddress.address === address.address\n                 }" ng-click=activate(address)><span class=address-list-index>/{{address.path[address.path.length-1]}}</span> <span class=address-list-address>{{address.address}}</span> <span class=address-verify ng-if="\n                      device.supports(\'addressVerification\') \n                      " ng-class="{nonactive: (activeAddress.address !== address.address)}"><div ng-if=device.isConnected() ng-hide=address.verification><button class="btn btn-link btn-verifyaddress" ng-click=verify(address) tooltip="Show on TREZOR" tooltip-placement=bottom tooltip-append-to-body=1><span class="glyphicon glyphicon-eye-open"></span></button></div><div ng-if=!device.isConnected() tooltip="Connect your device to display this address" tooltip-placement=bottom tooltip-append-to-body=1><button class="btn btn-link btn-verifyaddress" disabled><span class="glyphicon glyphicon-eye-open"></span></button></div></span></a><div class=line-divider ng-show=$first><hr><div class="line-divider-content text-center"><button class="btn btn-xs btn-default" ng-disabled="\n                          enoughAddresses()\n                          " ng-click=more()>More please <span class="glyphicon glyphicon-plus"></span></button></div></div></div></div><div ng-show="\n                enoughAddresses()\n               "><p class=text-danger>To access subsequent addresses, please use some of the listed addresses in a transaction.</p></div></div><div class=col-md-4><div><h5>QR Code</h5><a class=address-qr-link href={{blockExplorer.urlAddress}}{{activeAddress.address}} target=_blank title="Address info at {{blockExplorer.name}}"><qr size=210 text=activeAddress.address correction-level="\'M\'" type-number=0 input-mode="\'8bit\'"></qr></a></div><div ng-if=activeAddress><h5>Details</h5><ul class=list-unstyled><li ng-if=activeAddress.path><span class=h6>BIP32 Path:</span> <small class=text-monospace>{{ activeAddress.path | bip32Path }}</small></li><li ng-if=activeAddress.received><span class=h6>Total Received:</span> <small class=text-success>{{ activeAddress.received | amount }} {{account.coin.coin_shortcut}}</small></li></ul></div></div></div></div></div></div>'), a.put("views/account/send/buttonBar.html", '<div class=clearfix><div class=pull-left tooltip="{{!(device.isConnected())\n                ? \'Please connect your device to send coins.\'\n                : (\n                    ((!tx.prepared) || (isChangeHapenning()) || device.isLoading()) ?\n                        \'Please wait a few seconds...\' \n                        : null\n                )}}" tooltip-trigger=mouseenter tooltip-placement=bottom><button type=submit class="btn btn-primary btn-lg" ng-disabled="!device.canSendTx() || !tx.prepared || isChangeHapenning()">Send</button></div><div class="checkbox high-fees-checkbox"><label class=high-fees-label><input type=checkbox ng-model=tx.higherFees> Priority miner fee<br><span class=text-muted ng-if=tx.higherFees>TREZOR will ask for an extra confirmation.</span></label></div><div class="tx-submit-additional pull-right btn-group"><button type=button class="btn btn-default btn-sm" ng-click=addOutput()><span class="glyphicon glyphicon-plus"></span> Add recipient</button> <button type=button class="btn btn-default btn-sm dropdown-toggle" data-toggle=dropdown><span class=caret></span></button><ul class=dropdown-menu><li><a href="" ng-click=promptCsv()><span class="glyphicon glyphicon-import"></span> Import from CSV</a></li><li><a href="" ng-click=removeAllOutputs()><span class="glyphicon glyphicon-remove"></span> Remove all recipients</a></li></ul></div></div>'), a.put("views/account/send/main.html", '<div ng-controller=DeviceCtrl><div ng-controller=AccountCtrl><div class="alert alert-danger alert-inconsistent" ng-show=account.isInconsistent()><strong>Warning!</strong> Account balance information is inconsistent.</div><ng-include src="\'views/account/nav.html\'"></ng-include><div ng-controller=AccountSendCtrl><form name=form class=form-horizontal ng-submit=send()><div class="tab-content tx-send"><fieldset class=overlay-container><ng-include src="\'views/account/send/removeAllOutputs.html\'"></ng-include><div class=tx-output ng-repeat="output in tx.outputs"><ng-include src="\'views/account/send/txOutput.html\'"></ng-include></div><div class="tx-submit form-group"><div class="col-sm-10 col-sm-push-2"><ng-include src="\'views/account/send/buttonBar.html\'"></ng-include><ng-include src="\'views/account/send/txError.html\'"></ng-include><ng-include src="\'views/account/send/txPrepared.html\'"></ng-include></div></div><div class="overlay overlay-default" ng-if=sending><div class=overlay-max-wrapper><div class="overlay-content text-center"><p><span class=icon-loading></span></p><p class="h4 text-muted">Signing and sending transaction&hellip;</p></div></div></div></fieldset></div></form></div></div></div>'), a.put("views/account/send/removeAllOutputs.html", '<div class=tx-removeall ng-show="tx.outputs.length > 5"><a href="" ng-click=removeAllOutputs()>Remove all recipients</a></div>'), a.put("views/account/send/txAddress.html", '<div class=form-group ng-class="{ \'has-error\': output.addressError }"><label for=address class="control-label col-sm-2">Address</label><div class="col-sm-8 col-lg-7"><span class=input-with-icon><input id=address class=form-control autocomplete=off ng-model=output.address typeahead="\n                address.address as address.label\n                for address in suggestAddresses() | filter:$viewValue" required> <a href="" class="glyphicon glyphicon-qrcode input-icon text-muted" tooltip="Scan QR code" tooltip-append-to-body=true ng-click=scanQr(output) ng-show="!output.address && qr.enabled"></a></span> <span class=help-block>{{output.addressError}}</span></div><ng-include src="\'views/account/send/txRemoveOutput.html\'"></ng-include></div>'), a.put("views/account/send/txAmount.html", '<div class=form-group ng-class="{\'has-error\': output.amountError}"><label for=amount class="control-label col-sm-2">Amount</label><div class=tx-amount><div class="col-xs-6 col-sm-4 col-lg-4"><div class="input-group tx-amount-group-btc"><input id=amount class="form-control tx-amount-btc" ng-model=output.amount ng-if=!(output.maxCounting) ng-change=output.convertToFiat() required> <input id=amount class="form-control tx-amount-btc" value=counting... ng-if=output.maxCounting disabled><div class="input-group-addon tx-amount-sendall" ng-click=setMax(output) tooltip="Set maximum possible amount" tooltip-trigger=mouseenter tooltip-placement=bottom tooltip-append-to-body=1><span class="glyphicon glyphicon-arrow-up"></span></div><div class=input-group-addon>{{account.coin.coin_shortcut}}</div></div><span class=help-block ng-if=output.amountError>{{output.amountError}}</span></div><div class=input-wrapper ng-if="fiatCurrencies.length > 0"><div class="col-sm-4 col-xs-6 col-lg-3"><p class=tx-amount-sep>=</p><input class="form-control tx-amount-fiat" ng-model=output.amountFiat ng-change=output.convertToBtc() ng-if=!(output.maxCounting)> <input class="form-control tx-amount-fiat" value=counting... ng-if=(output.maxCounting) disabled><select class=form-control ng-model=output.currencyFiat ng-change=output.convertToFiat() ng-options="currency for currency in fiatCurrencies"></select></div></div></div></div>'), a.put("views/account/send/txError.html", '<div class="form-control-static text-danger" ng-show=tx.error>{{tx.error}}</div>'), a.put("views/account/send/txOutput.html", "<ng-include src=\"'views/account/send/txAddress.html'\"></ng-include><ng-include src=\"'views/account/send/txAmount.html'\"></ng-include><hr ng-hide=$last>"), a.put("views/account/send/txPrepared.html", '<div class="form-control-static tx-preview" ng-show=tx.prepared><h6><span tooltip="The transaction fee is calculated automatically." tooltip-placement=bottom tooltip-append-to-body=true>Fee: {{tx.prepared.fee | amount}} {{account.coin.coin_shortcut}}</span></h6><div class=text-muted><h6>Inputs:</h6><ol class=list-unstyled><li ng-repeat="input in tx.prepared.inputs">{{ input.prev_hash.substr(0, 31) }}&#8203;{{ input.prev_hash.substr(31) }}:{{input.prev_index}}</li></ol><h6>Outputs:</h6><ol class=list-unstyled><li ng-repeat="output in tx.prepared.outputs"><strong>{{output.amount | amount}} {{account.coin.coin_shortcut}}</strong><br><span ng-if=output.address>{{output.address}}</span> <span ng-if=output.address_n>{{output.address_n | bip32Path}} (the change address)</span></li></ol></div></div>'), a.put("views/account/send/txRemoveOutput.html", '<div class="col-sm-2 col-lg-3"><button type=button class="btn btn-link pull-right" ng-show="(tx.outputs.length > 1) || (!output.isEmpty())" ng-click=removeOutput(output) tooltip="Remove recipient"><span class=text-muted><span class="glyphicon glyphicon-remove"></span> <span class=sr-only>Remove</span></span></button></div>'), a.put("views/account/sign.html", '<div ng-controller=DeviceCtrl><div ng-controller=AccountCtrl><ng-include src="\'views/account/nav.html\'"></ng-include><div class="tab-content sign" ng-controller=AccountSignCtrl><div class=row><div class=col-md-6><form name=form ng-submit="signSaveAddress() && sign()"><fieldset><legend>Sign message</legend><div class=alert ng-show="hasErrorMessage(\'sign\')" ng-class="getAlertClass(\'sign\')">{{sign.res.message}}</div><div class=form-group><label for=sign-message>Message</label><textarea class=form-control name=message id=sign-message ng-model=sign.message ng-change=resetSign() maxlength=255 rows=4></textarea></div><div class="alert alert-warning" role=alert ng-show="sign.message.length>245 && !(isUnicode(sign.message)) " ng-class="{\'alert-danger\': sign.message.length==255}"><strong>Warning:</strong> Maximal message length is 255 letters long. Your message is {{sign.message.length}} letters long.</div><div class="alert alert-warning" role=alert ng-show="sign.message.length>54 && sign.message.length<=245 && !(isUnicode(sign.message))"><strong>Warning:</strong> Trezor can show only 64 letters on the display. Your message is {{sign.message.length}} letters long.</div><div class="alert alert-danger" role=alert ng-show=isUnicode(sign.message)>Trezor cannot sign non-ASCII characters. "{{nonAsciiCharacter(sign.message)}}" in your message is not an ASCII character.</div><div class="form-group has-feedback" ng-class=getSignAddressClass()><label for=sign-address>Address</label><input class=form-control name=address id=sign-address ng-model=sign.address ng-change="resetSign(); signSaveAddress()" autocomplete=off> <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden=true></span> <span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden=true></span><div class=loading-sign-info ng-show=isSignAddressLoading()><div class=loading-sign-info-text>Please wait...</div><span class="glyphicon glyphicon-refresh"></span></div></div><div class=form-group><label for=sign-signature>Signature</label><textarea class=form-control name=signature id=sign-signature rows=4 readonly ng-model=sign.signature></textarea></div><div class=pull-left tooltip="{{ \n                            !(device.isConnected()) ? \n                                \'Please connect your device to sign messages.\'\n                                :\n                                (\n                                    !isSignInputValid() ? \'Please fill in message and address.\' : null \n                                )\n                                }}" tooltip-trigger=mouseenter tooltip-placement=right><button type=submit class="btn btn-primary" ng-disabled="!isSignInputValid() || !device.isConnected()" ng-hide=isUnicode(sign.message)>Sign</button></div></fieldset></form></div><div class=col-md-6><form name=form ng-submit=verify()><fieldset><legend>Verify message</legend><div class=alert ng-show="hasErrorMessage(\'verify\')" ng-class="getAlertClass(\'verify\')">{{verify.res.message}}</div><div class=form-group><label for=verify-message>Message</label><textarea class=form-control name=message id=verify-message required ng-model=verify.message ng-change="verify.res.status = null" maxlength=255 rows=4></textarea></div><div class="alert alert-warning" role=alert ng-show="verify.message.length>245 && !(isUnicode(verify.message)) " ng-class="{\'alert-danger\': verify.message.length==255}"><strong>Warning:</strong> Maximal message length is 255 letters long. Your message is {{verify.message.length}} letters long.</div><div class="alert alert-warning" role=alert ng-show="verify.message.length>54 && verify.message.length<=245 && !(isUnicode(verify.message))"><strong>Warning:</strong> Trezor can show only 64 letters on the display. Your message is {{verify.message.length}} letters long.</div><div class="alert alert-danger" role=alert ng-show=isUnicode(verify.message)>Trezor cannot verify non-ASCII characters. "{{nonAsciiCharacter(verify.message)}}" in your message is not an ASCII character.</div><div class=form-group><label for=verify-address>Address</label><input class=form-control name=address id=verify-address required ng-model=verify.address ng-change=resetVerify() autocomplete=off></div><div class=form-group><label for=verify-signature>Signature</label><textarea class=form-control name=signature id=verify-signature rows=4 ng-model=verify.signature ng-change=resetVerify()></textarea></div><div class=pull-left tooltip="{{ !(device.isConnected()) ? \'Please connect your device to verify messages.\':null}}" tooltip-trigger=mouseenter tooltip-placement=right><button type=submit class="btn btn-primary" ng-hide=isUnicode(verify.message) ng-disabled=!device.isConnected()>Verify</button></div></fieldset></form></div></div></div></div></div>'), a.put("views/debug.button.html", '<span ng-controller=DebugCtrl ng-if=!debug.visible><button class="btn btn-xs btn-link pull-right" ng-click=debug.toggle() tooltip="Show log"><span class="glyphicon glyphicon-list"></span> <span class=sr-only>Show log</span></button></span>'), a.put("views/debug.link.html", '<span ng-controller=DebugCtrl ng-cloak><a href="" ng-click=debug.toggle()>Show log</a></span>'), a.put("views/debug.log.html", '<div ng-controller=DebugCtrl ng-cloak><div class="alert alert-flash alert-info alert-logs" ng-if=debug.visible><button type=button class=close ng-click=debug.toggle()><span aria-hidden=true>&times;</span> <span class=sr-only>Close</span></button><h4>Log</h4><textarea ng-click=debug.focus($event)>{{debug.logs}}</textarea><p>Warning: This log can contain your XPUB. When you give it to a third party, you allow it to see your whole transaction history.</p></div></div>'), a.put("views/device/advanced.html", '<div ng-controller=DeviceCtrl><div ng-controller=DeviceInfoCtrl><ng-include src="\'views/device/nav.html\'"></ng-include><div class=tab-content ng-hide=device.isEmpty()><div class=row><div class="col-md-2 settings-left">Firmware</div><div class="col-md-10 settings-right">{{device.firmwareString()}}</div></div><div class=row><div class="col-md-2 settings-left">Passphrase</div><div class="col-md-6 settings-right" ng-hide=device.features.passphrase_protection ng-init="userUnderstandsPassphrase = false"><p>Passphrase encryption allows you to access new wallets, each hidden behind a particular passphrase. Your old accounts will be accessible behind an empty passphrase.</p><p><b>If you forget your passphrase, your wallet is lost for good. There is no way to recover your funds.</b></p><a href=https://doc.satoshilabs.com/trezor-user/advanced_settings.html#using-passphrase-encrypted-seeds>Read more in user manual</a><p class=checkbox><label><input type=checkbox ng-model=userUnderstandsPassphrase> OK, I understand</label></p><span tooltip="{{\n                        device.isConnected() ? null : \'Connect the device to enable passphrase.\'\n                        }}" tooltip-trigger=mouseenter tooltip-placement=right tooltip-append-to-body=true class=tooltip-trigger><button class="btn btn-default btn-sm" ng-click=togglePassphrase(true) ng-disabled="!device.isConnected() || !userUnderstandsPassphrase"><span class="glyphicon glyphicon-ok"></span> <span>Enable passphrase encryption</span></button></span></div><div class="col-md-6 settings-right" ng-show=device.features.passphrase_protection ng-init="userUnderstandsPassphrase = false"><p><b>If you disable the passphrase encryption, your current funds will not appear.</b> You will have to enable the passphrase encryption again to see your current wallet.</p><p><a href=https://doc.satoshilabs.com/trezor-user/advanced_settings.html#using-passphrase-encrypted-seeds>Read more in user manual</a></p><p class=checkbox><label><input type=checkbox ng-model=userUnderstandsPassphrase> OK, I understand</label></p><span tooltip="{{\n                        device.isConnected() ? null : \'Connect the device to disable passphrase.\'\n                        }}" tooltip-trigger=mouseenter tooltip-placement=right tooltip-append-to-body=true class=tooltip-trigger><button class="btn btn-default btn-sm" ng-click=togglePassphrase(false) ng-disabled="!device.isConnected() || !userUnderstandsPassphrase"><span class="glyphicon glyphicon-remove hidden-xs hidden-sm hidden-md"></span> <span>Disable passphrase encryption</span></button></span></div></div><hr><div class=row ng-show=device.features.pin_protection><div class="col-md-2 settings-left">Disable PIN</div><div class="col-md-2 settings-btn" tooltip="{{device.isConnected()?\n                      null\n                      :\'Connect the device to disable PIN.\'\n                      }}" tooltip-trigger=mouseenter tooltip-placement=right tooltip-append-to-body=true><button class="btn btn-default btn-sm" ng-click=changePin(true) ng-disabled=!device.isConnected()><span class="glyphicon glyphicon-remove hidden-xs hidden-sm hidden-md"></span> <span>Disable PIN</span></button></div></div><div class=row ng-enabled=!device.isConnected() ng-show=device.features.pin_protection><div class=col-md-2></div><p class="text-muted col-md-6">Using PIN protection is highly recommended. PIN prevents unauthorized persons from stealing your bitcoins even when they get physical access to your device.</p></div><hr ng-show=device.features.pin_protection><div class=row><div class="col-md-2 settings-left">Wipe device</div><div class="col-md-6 wipe-text"><p>Wiping the device <b>removes all its information.</b></p><p>Use this feature only if you have your Recovery Seed or you don\'t have any coins on your device.</p><div ng-controller=DeviceWipeCtrl><div class=pull-left tooltip="{{!device.isConnected() ? \'Device needs to be connected in order to wipe it.\' : null}}" tooltip-trigger=mouseenter tooltip-placement=bottom tooltip-append-to-body=true><a class="btn btn-danger wipe-button" href="" ng-click=wipeDevice() ng-disabled=!device.isConnected()><span class="glyphicon glyphicon-fire"></span> Wipe device</a></div></div></div></div></div></div></div>'), a.put("views/device/index.basic.html", '<div ng-controller=DeviceInfoCtrl><div class=row><div class="col-md-2 settings-left">Label</div><div class="col-md-2 settings-right">{{device.label()}}</div><div class="col-md-2 settings-btn" tooltip="{{device.isConnected()?null: \'Connect the device to change the label.\'}}" tooltip-trigger=mouseenter tooltip-placement=right tooltip-append-to-body=true><button class="btn btn-default btn-sm" ng-click=changeLabel(device) ng-disabled=!device.isConnected()><span class="glyphicon glyphicon-pencil hidden-xs hidden-sm hidden-md"></span> Change label</button></div></div><div class=row><div class="col-md-2 settings-left">PIN protection</div><div class="col-md-2 settings-right"><span ng-show=device.features.pin_protection class=text-success>Enabled</span> <span ng-hide=device.features.pin_protection class=text-danger>Disabled</span></div><div class="col-md-2 settings-btn" tooltip="{{device.isConnected()? \n                  null:\n                (device.features.pin_protection ? \n                    \'Connect the device to change PIN.\'\n                   :\'Connect the device to enable PIN.\'\n                )}}" tooltip-trigger=mouseenter tooltip-placement=right tooltip-append-to-body=true><button class="btn btn-default btn-sm" ng-click=changePin() ng-disabled=!device.isConnected()><span class="glyphicon glyphicon-pencil hidden-xs hidden-sm hidden-md" ng-show=device.features.pin_protection></span> <span class="glyphicon glyphicon-ok hidden-xs hidden-sm hidden-md" ng-hide=device.features.pin_protection></span> <span ng-show=device.features.pin_protection>Change PIN</span> <span ng-hide=device.features.pin_protection>Enable PIN</span></button></div></div><div class=row ng-enabled=!device.isConnected() ng-show="\n            !(device.features.pin_protection)\n            "><div class=col-md-2></div><p class="text-muted col-md-6">Using PIN protection is highly recommended. PIN prevents unauthorized persons from stealing your bitcoins even when they get physical access to your device.</p></div><div class=row><div class="col-md-2 settings-left">Total balance</div><div class="col-md-10 settings-right" ng-hide=device.isLoading()>{{device.balance() | amount}} {{device.defaultCoin().coin_shortcut}}</div><div class="col-md-10 settings-right" ng-show=device.isLoading()>Loading...</div></div><hr><div ng-if="!(device.accounts.length) && !device.isLoading()"><h4>Account public keys (XPUB)</h4><p class="alert alert-warning alert-withicon"><span class="glyphicon glyphicon-info-sign alert-icon"></span> This Trezor has no loaded accounts. Connect it to load them.</p></div><div ng-if="!(device.accounts.length) && device.isLoading()"><h4>Account public keys (XPUB)</h4><p class="alert alert-warning alert-withicon"><span class="glyphicon glyphicon-info-sign alert-icon"></span> Accounts are currently loading, wait a few seconds, please.</p></div><div class=row ng-if=device.accounts.length><div class="col-md-2 settings-left">Account public keys (XPUB)</div><div class="col-md-2 settings-btn btn-padding" ng-hide=xpubDisplayed><button class="btn btn-default btn-sm" ng-click=xpubDisplay() ng-hide=xpubDisplayed>Show XPUBs</button></div><div class=col-md-6 ng-show=xpubDisplayed><div class=list-group><div ng-repeat="account in device.accounts"><span class="list-group-item xpub-list-item" ng-class="{active: activeXpub === account.publicKey() }" ng-click=activateXpub(account.publicKey())><span class=xpub-in>{{account.publicKey()}}</span> &nbsp;&nbsp;&nbsp; <span class=xpub-label>{{account.label()}}</span></span></div></div><p class=text-muted><b>Be careful with your XPUBs.</b> When you give them to a third party, you allow it to see your whole transaction history. <a href="" ng-click=learnMoreXpub() ng-hide=learnMoreXpubDisplayed>Learn more</a></p><p class=text-muted ng-show=learnMoreXpubDisplayed>Click on XPUB to show its QR code. Scan it into an application that supports XPUBs such as <a target=_blank href="https://play.google.com/store/apps/details?id=com.satoshilabs.btcreceive">myTREZOR Lite</a> for Android. Then, you can watch your transactions and receive payments everywhere without carrying your TREZOR.</p></div><div class=col-md-4 ng-show=xpubDisplayed><div ng-if=activeXpub class=xpubqr><qr size=262 text=activeXpub></qr></div></div></div><div class=row ng-hide=xpubDisplayed><div class="col-md-2 settings-left"></div><div class=col-md-6><p class=text-muted><b>Be careful with your XPUBs.</b> When you give them to a third party, you allow it to see your whole transaction history. <a href="" ng-click=learnMoreXpub() ng-hide=learnMoreXpubDisplayed>Learn more</a></p><p class=text-muted ng-show=learnMoreXpubDisplayed>Click on XPUB to show its QR code. Scan it into an application that supports XPUBs such as <a target=_blank href="https://play.google.com/store/apps/details?id=com.satoshilabs.btcreceive">myTREZOR Lite</a> for Android. Then, you can watch your transactions and receive payments everywhere without carrying your TREZOR.</p></div></div></div>'), a.put("views/device/index.html", '<div ng-controller=DeviceCtrl><fieldset class=row ng-disabled="device.status() !== \'connected\'"><div class="devsetup col-md-8" ng-show=device.isEmpty()><ng-include src="\'views/device/index.setup.html\'"></ng-include></div><div class="devrestore col-md-4 text-center" ng-show=device.isEmpty()><p class=help-block>Want to restore your wallet from recovery seed?</p><a class="btn btn-default" ng-href=#/device/{{device.id}}/recovery>TREZOR Recovery</a></div></fieldset><div ng-if=!(shouldDisplayLoading())><ng-include src="\'views/device/nav.html\'"></ng-include><div class=tab-content ng-hide=device.isEmpty()><ng-include src="\'views/device/index.basic.html\'"></ng-include></div></div><div ng-if=shouldDisplayLoading()><ng-include src="\'views/device/loading.jumbotron.html\'"></ng-include></div></div>'), a.put("views/device/index.setup.html", '<form ng-controller=DeviceSetupCtrl><h3>Welcome to TREZOR Setup!</h3><p class=lead>Please take your time to read all of the instructions. Setting up your TREZOR will take only a few minutes. When you\'re done, you can start using your TREZOR.</p><div class=form-group><label for=label>Device label</label><input name=label id=label class=form-control placeholder="My TREZOR" ng-model=settings.label><p class=help-block>This label will be shown on the display when you plug your TREZOR in. This is useful if you have more than one device.</p></div><div class="form-group text-center"><button class="btn btn-lg btn-success" ng-click=setupDevice()>Continue</button></div></form>'), a.put("views/device/load.html", '<div ng-controller=DeviceCtrl><div ng-if=!device.isConnected() class="alert alert-warning"><strong>Please connect your device</strong> to access this section.</div><div class="alert alert-warning alert-withicon alert-lg"><span class="glyphicon glyphicon-warning-sign alert-icon"></span><p>This is an advanced interface intended for EXPERT use only!</p><p>If you are a common user and want to setup or recover your TREZOR device, please continue to <a href=#/device/{{device.id}}/setup>TREZOR Setup</a>.</p><p>Never use this process unless you REALLY know what you are doing!</p><p>No checks are performed on the provided seed, so it can be binary sequence, dice-throw sequence or a random sentence. Valid BIP32 XPRV keys are interpreted prior loading to the device.</p></div><div ng-controller=DeviceLoadCtrl class=row><fieldset ng-disabled=!device.isConnected()><form name=form class="devload col-md-6"><div class=form-group><label for=label class=control-label>Device label</label><input name=label id=label class=form-control placeholder="My TREZOR" ng-model=settings.label></div><div class=form-group><label for=payload class=control-label>Recovery seed or XPRV private key</label><textarea name=payload id=payload class=form-control required ng-model=settings.payload></textarea></div><div class=checkbox><label><input type=checkbox name=skip-checksum ng-model=settings.skip_checksum> Skip mnemonic checksum</label></div><div class=form-group><label for=pin class=control-label>PIN</label>&nbsp;(leave empty to keep PIN protection disabled) <input name=pin id=pin class=form-control ng-model=settings.pin></div><div class=checkbox><label><input type=checkbox name=passphrase-protection ng-model=settings.passphrase_protection> Additional passphrase encryption</label></div><div class=form-group><button class="btn btn-primary" ng-disabled=!form.$valid ng-click=loadDevice()>Continue</button> <a href=#/device/{{device.id}} class="btn btn-link">Cancel</a></div></form></fieldset></div></div>'), a.put("views/device/loading.jumbotron.html", '<div class="jumbotron text-center col-md-7 jumbotron-nomargin jumbotron-white"><div class=icon-connect></div><span class="glyphicon-gears main-icon"></span><h2>Loading</h2><p>MyTREZOR is loading accounts from your device</p></div>'), a.put("views/device/nav.html", '<ul ng-controller=NavCtrl class="nav nav-tabs" ng-hide=device.isEmpty()><li ng-class="{ active: isActive(\'/device/{{device.id}}$\') }"><a class=btn href=#/device/{{device.id}}><span class=glyphicon-trezor></span> Basic</a></li><li ng-class="{ active: isActive(\'/device/{{device.id}}/advanced$\') }"><a class=btn href=#/device/{{device.id}}/advanced><span class="glyphicon glyphicon-stats"></span> Advanced</a></li></ul>'), a.put("views/device/noaccounts.jumbotron.html", '<div class="jumbotron text-center col-md-7 jumbotron-nomargin jumbotron-white"><div class=icon-connect></div><span class="glyphicon-connect-trezor main-connect-icon"></span><h2>No accounts</h2><p>Your device is not fully loaded. Reconnect it to use it.</p></div>'), a.put("views/device/recovery.html", '<div ng-controller=DeviceCtrl><div ng-if=!device.isConnected() class="alert alert-warning"><strong>Please connect your device</strong> to access this section.</div><div ng-controller=DeviceRecoveryCtrl class=row><fieldset class=col-md-12 ng-show=recovering ng-disabled=!device.isConnected()><h4>Seed recovery</h4><div class="alert alert-info">Please follow the instructions on your device. Words are going to be entered in shuffled order.<br>Also you\'ll be asked to retype some words that are not part of your recovery seed.</div><form class=form-inline><div class=form-group><input class="form-control input-lg" ng-if=!wordCallback placeholder=Processing... disabled> <input class="input-seedword form-control input-lg" placeholder="Enter seed word" ng-model=$parent.seedWord ng-if=wordCallback focus typeahead-editable=false typeahead-on-select=recoverWord() typeahead="word for word in seedWordlist | filter:$viewValue:startsWith | limitTo:10"> <span ng-if=wordCallback class=help-block>Confirm choice by pressing enter.</span></div></form><h5 ng-show=seedWords.length>Recovered seed words:</h5><ul class=list-group><li class=list-group-item ng-repeat="word in seedWords track by $index">{{word}}</li></ul></fieldset><fieldset class=col-md-6 ng-show=!recovering ng-disabled=!device.isConnected()><form name=form class=devrecover><div class=form-group><label for=label class=control-label>Device label</label><input name=label id=label class=form-control placeholder="My TREZOR" ng-model=settings.label></div><div class=form-group><label for=word_count class=control-label>Number of words in your recovery seed</label><input name=word_count id=word_count class=form-control slider data-slider-value=24 data-slider-min=12 data-slider-max=24 data-slider-step=6 data-slider-tooltip=hide ng-model=settings.word_count><div class="row devsetup-strength"><div class="col-sm-4 text-left">12 words</div><div class="col-sm-4 text-center">18 words</div><div class="col-sm-4 text-right">24 words</div></div></div><div class=checkbox><label><input type=checkbox name=pin-protection ng-model=settings.pin_protection> Enable PIN protection</label></div><div class=checkbox><label><input type=checkbox name=passphrase-protection ng-model=settings.passphrase_protection> Additional passphrase encryption</label></div><div class=form-group><button class="btn btn-primary" ng-disabled=!form.$valid ng-click=recoverDevice()>Continue</button> <a href=#/device/{{device.id}} class="btn btn-link">Cancel</a></div></form></fieldset></div></div>'), a.put("views/device/wipe.html", '<div ng-controller=DeviceCtrl><div ng-if=!device.isConnected() class="alert alert-warning"><strong>Please connect your device</strong> to access this section.</div><div ng-controller=DeviceWipeCtrl><fieldset ng-disabled=!device.isConnected()><div class="alert alert-danger alert-withicon alert-lg"><span class="glyphicon glyphicon-warning-sign alert-icon"></span><h4>Do you really want to wipe the device?</h4><p>All data from the device will be lost! You can recover your funds using recovery seed.<br></p><p class=alert-buttons><button class="btn btn-danger" ng-click=wipeDevice()>Wipe</button> <a href=#/device/{{device.id}} class="btn btn-link">Cancel</a></p></div></fieldset></div></div>'), a.put("views/deviceDetails.displayed.html", '<div ng-controller=DebugCtrl ng-cloak><div class="alert alert-flash alert-info alert-device-details" ng-if=deviceDetails.visible><button type=button class=close ng-click=deviceDetails.toggle()><span aria-hidden=true>&times;</span> <span class=sr-only>Close</span></button><p><strong>Transport:</strong> {{transportType}}</p><p ng-repeat="device in devices()"><strong>Device {{device.id}}:</strong><br>firmware {{device.firmwareString()}}, initialized: {{device.features.initialized}}, has passphrase: {{device.features.passphrase_protection}}, has pin: {{device.features.pin_protection}}, bootloader mode: {{device.features.bootloader_mode?"true":"false"}}</p></div></div>'), a.put("views/deviceDetails.link.html", '<span ng-controller=DebugCtrl ng-cloak><a href="" ng-click=deviceDetails.toggle()>Device details</a> |</span>'), a.put("views/error.html", '<div class=row ng-if=installed><div class="col-md-6 col-md-offset-3"><div class="alert alert-danger clearfix"><h4>Transport loading failed</h4>{{errorMessage}}<ng-include src="\'views/debug.button.html\'"></ng-include></div><ng-include src="\'views/debug.log.html\'"></ng-include></div></div><div ng-if=!installed><ng-include src="\'views/error.install.html\'"></ng-include></div>'), a.put("views/error.install.html", '<ng-include src="\'views/deviceDetails.displayed.html\'"></ng-include><ng-include src="\'views/debug.log.html\'"></ng-include><div class=row ng-if=!installed><div class="jumbotron installers col-md-6 col-md-push-3"><h3>Hi, you\'re almost there!</h3><div ng-if=browser.chrome><p class=installers-info>Please install TREZOR Chrome Extension to allow myTREZOR to talk with your device.</p><p class="form-inline text-center installers-chrome-primary-form"><button class="btn-installer-download btn btn-lg btn-success" ng-click=installChromeExtension(chromeExtension.id)><span class="glyphicon glyphicon-download"></span> Install</button></p><hr><p class="text-muted installers-muted">Do you use other browsers on this computer? Install the TREZOR Bridge, a standalone application that works the same way &mdash; but with every browser.</p><p class="form-inline text-center"><a class="btn-installer-download btn btn-default" ng-href="{{ selectedInstaller.url }}"><span class="glyphicon glyphicon-download"></span> Download</a><select class=form-control placeholder="Select platform..." ng-model=selectedInstaller ng-options="\n                                    installer as \'for \' + installer.label\n                                    for installer\n                                    in installers\n                                    track by installer.platform"></select></p></div><div ng-if=!browser.chrome><p class=installers-info>Please install TREZOR Bridge to allow myTREZOR to talk with your device.</p><div class="text-center installers-chrome-primary-form"><p class=form-inline><a class="btn-installer-download btn btn-lg btn-success" ng-href="{{ selectedInstaller.url }}"><span class="glyphicon glyphicon-download"></span> Download</a><select class=form-control placeholder="Select platform..." ng-model=selectedInstaller ng-options="\n                                        installer as \'for \' + installer.label\n                                        for installer\n                                        in installers\n                                        track by installer.platform"></select></p></div><hr><p class="text-muted installers-muted">Do you use Google Chrome on this computer? With <a target=_blank href=https://chrome.google.com/webstore/detail/{{chromeExtension.id}}>TREZOR Chrome Extension</a> you can use myTREZOR in Chrome without installing any other software.</p></div><div class="text-center text-muted installers-footer">myTREZOR Web Wallet is a free service provided exclusively to <a href=http://www.bitcointrezor.com>TREZOR hardware wallet</a> owners.</div></div></div>'), a.put("views/error.udev.html", '<div class=row><div class="jumbotron installers col-md-6 col-md-push-3"><h3>Great, the extension installed successfully!</h3><div><p>For Linux users, one last step is needed to get started. Please download and install this small package.</p><div><p class=form-inline><span class=udev-number>&#9312;</span> <a class="btn-installer-download btn btn-lg btn-success" ng-href="{{ selectedUdevInstaller.url }}"><span class="glyphicon glyphicon-download"></span> Download</a><select class=form-control placeholder="Select platform..." ng-model=selectedUdevInstaller ng-options="\n                                    udevInstaller as udevInstaller.label\n                                    for udevInstaller\n                                    in udevInstallers\n                                    track by udevInstaller.platform"></select></p></div><p class=udev-number-connect>&#9313;</p><p class=udev-text-connect><span class="glyphicon-connect-trezor udev-glyphicon"></span> Reconnect your TREZOR</p><hr><p class="text-muted installers-muted">The package configures UDEV rules, that are necessary for communication between the device and Chrome browser. <a href=http://doc.satoshilabs.com/trezor-user/settingupchromeonlinux.html>For more information or manual configuration steps, read our user manual.</a></p></div><div class="text-center text-muted installers-footer">myTREZOR Web Wallet is a free service provided exclusively to <a href=http://www.bitcointrezor.com>TREZOR hardware wallet</a> owners.</div></div></div>'), a.put("views/import.html", '<div ng-controller=ImportCtrl><div class=row><fieldset><form name=form class="devimport col-md-6"><div class="alert alert-warning alert-withicon alert-lg"><span class="glyphicon glyphicon-warning-sign alert-icon"></span><p>This is an advanced interface intended for developer use only!</p><p>Never use this process unless you really know what you are doing!</p></div><div class=form-group><label for=label class=control-label>Device ID</label><input name=id id=id class=form-control ng-model=settings.id></div><div class=form-group><label for=label class=control-label>Device label</label><input name=label id=label class=form-control placeholder="My TREZOR" ng-model=settings.label></div><div class=form-group><label for=payload class=control-label>Account XPUBs <small>(1 per row)</small></label><textarea name=payload id=payload class=form-control ng-model=settings.payload></textarea></div><div class=form-group><button class="btn btn-primary" ng-click=importDevice()>Continue</button> <a href="#/" class="btn btn-link">Cancel</a></div></form></fieldset></div></div>'), a.put("views/main.html", '<div class=row ng-controller=MainCtrl><div class="jumbotron text-center col-md-7" ng-if="isEmpty() && !(udevError.errorStatus)"><span class="glyphicon-connect-trezor main-connect-icon"></span><h2>Get started!</h2><p>Connect your TREZOR device to the computer.</p></div></div>'), a.put("views/modal/button.html", '<ng-include src="\'views/modal/upperheader.html\'"></ng-include><div class="modal-body text-center" ng-switch=code><div ng-switch-when=ButtonRequest_FeeOverThreshold class="alert alert-block alert-info"><h4>Fee is over threshold.</h4>Please confirm the action on your device.</div><div ng-switch-when=ButtonRequest_ConfirmOutput class="alert alert-block alert-info"><h4>Please confirm the transaction output on your device.</h4><div class=row><div class="col-md-6 col-md-offset-3"><samp class=samp-screen ng-if=output>{{ output.amount | amount }} {{ account.coin.coin_shortcut }}<br>to<br>{{ output.address.substr(0, 17) }}<br>{{ output.address.substr(17) }}</samp></div></div></div><div ng-switch-when=ButtonRequest_SignTx class="alert alert-block alert-info"><h4>Please confirm the transaction on your device.</h4><div class=row><div class="col-md-6 col-md-offset-3"><samp class=samp-screen ng-if=tx>Really send<br>{{ ( tx.outputSum + tx.fee ) | amount }} {{ account.coin.coin_shortcut }}<br>from your wallet?<br>Fee included:<br>{{ tx.fee | amount }} {{ account.coin.coin_shortcut }}</samp></div></div></div><div ng-switch-when=ButtonRequest_ConfirmWord class="alert alert-block alert-info"><h4>Please write down the recovery seed from your device.</h4></div><div ng-switch-when=ButtonRequest_Address class=address-modal><h5>Check address on TREZOR display</h5><p class=text-muted>If the address matches your TREZOR display, you can be sure it is genuine.</p><div class="list-group address-list"><span class="list-group-item address-list-item active"><span class=address-list-index>/{{address.path[address.path.length-1]}}</span> <span class=address-list-address>{{address.address}}</span></span></div><div class=address-qr><qr size=210 text=address.address correction-level="\'M\'" type-number=0 input-mode="\'8bit\'"></qr></div></div><div ng-switch-when=ButtonRequest_ProtectCall class="alert alert-warning alert-withicon alert-lg text-left" ng-if="!(device.features.passphrase_protection) && changing===\'passphrase\'"><span class="glyphicon glyphicon-warning-sign alert-icon"></span><h4>Confirm passphrase encryption</h4><p>If you forget your passphrase, you will lose your coins.</p></div><div ng-switch-when=ButtonRequest_ProtectCall class="alert alert-block alert-info" ng-if="(device.features.passphrase_protection) || changing!==\'passphrase\'"><h4>Please confirm the action on your device.</h4></div><div ng-switch-when=ButtonRequest_WipeDevice class="alert alert-warning alert-withicon alert-lg text-left"><span class="glyphicon glyphicon-warning-sign alert-icon"></span><h4>All data on your device will be deleted.</h4><p>This action cannot be undone. Please <strong>confirm on your device</strong>.</p><p>Never do this action with TREZOR holding coins unless you have your recovery seed at hand.</p></div><div ng-switch-default class="alert alert-block alert-info"><h4>Please confirm the action on your device.</h4></div></div>'), a.put("views/modal/csv.html", '<ng-include src="\'views/modal/upperheader.html\'"></ng-include><div class=modal-header><button type=button class=close title=Cancel ng-click=$dismiss()>&times;</button><h4 class=modal-title>Import addresses from CSV</h4></div><form role=form ng-submit=submit(values)><div class=modal-body><div><p class="alert alert-danger" ng-if=errMsg>{{errMsg}}</p><p>Example:</p><pre>address,amount\n1JwSSubhmg6iPtRjtyqhUYYH7bZg3Lfy1T,0.31337\n1C7zdTfnkzmr13HfA2vNm5SJYRK6nEKyq8,0.02342</pre><div class=form-group><label>Cell delimiter</label><input class=form-control ng-model=values.delimiter ng-trim=false></div><div class=checkbox><label><input type=checkbox ng-model=values.header> First row is header</label></div><div class=form-group><label>Paste the CSV here:</label><textarea class="form-control input-lg" cols=50 rows=10 autofocus ng-model=values.data></textarea></div></div></div><div class=modal-footer><button type=button class="btn btn-default" ng-click=$dismiss()>Cancel</button> <button type=submit class="btn btn-primary">Import</button></div></form>'), a.put("views/modal/disconnect.html", '<ng-include src="\'views/modal/upperheader.html\'"></ng-include><div class=modal-header><button type=button class=close title=Cancel ng-if=!disableCancel ng-click=$dismiss()>&times;</button><h4 class=modal-title>Disconnect your Trezor now</h4></div><div class=modal-body ng-if="customText==null">myTREZOR will forget your Trezor right after you disconnect it.</div><div class=modal-body ng-if="customText!=null">{{customText}}</div><div class=modal-footer ng-if=!disableCancel><button type=button class="btn btn-default" ng-click=$dismiss()>Cancel</button></div>'), a.put("views/modal/disconnect.wipe.html", '<ng-include src="\'views/modal/upperheader.html\'"></ng-include><div class=modal-header><h4 class=modal-title>Wipe finished</h4></div><div class=modal-body><p class="alert alert-success">Your Trezor was successfully wiped.</p><p>Please <strong>disconnect</strong> it now.</p></div>'), a.put("views/modal/firmware.html", '<ng-include src="\'views/modal/upperheader.html\'"></ng-include><div ng-switch=state><div ng-switch-when=initial><div class=modal-header><button type=button class=close title=Cancel ng-click=$dismiss()>&times;</button><h4 class=modal-title>Your device firmware is outdated</h4></div><div class=modal-body><p>Our team is constantly working on adding new features to TREZOR. To enjoy full functionality and security of your device, we strongly recommend you to update.</p><p></p><p><strong>To update the firmware, please disconnect your device and then plug it in while holding both device buttons pressed</strong>.</p><p class="alert alert-info alert-withicon"><span class="glyphicon glyphicon-info-sign alert-icon"></span> For more information <a href=http://doc.satoshilabs.com/trezor-user/updatingfirmware.html target=_blank>see the user manual</a>.</p><div class=firmware-info><h5>Firmware info</h5><dl><dt>Current firmware:</dt><dd>{{version[0]}}.{{version[1]}}.{{version[2]}}</dd><dt>Available firmware:</dt><dd>{{firmware.version[0]}}.{{firmware.version[1]}}.{{firmware.version[2]}}</dd></dl><div ng-if=firmware.changelog><h5>Changelog</h5><p class=firmware-changelog>{{firmware.changelog}}</p></div><p ng-if=firmware.notes><a ng-href={{firmware.notes}} target=_blank>Read the full release notes</a></p></div><a class="btn btn-link" href=mailto:support@bitcointrezor.com>Support needed?</a></div><div class=modal-footer ng-if=!firmware.required><button type=button class="btn btn-default" ng-click=$dismiss()>Cancel</button></div></div><div ng-switch-when=initial-disconnected><div class=modal-header><button type=button class=close title=Cancel ng-click=$dismiss()>&times;</button><h4 class=modal-title>Your device firmware is outdated</h4></div><div class=modal-body><p>Now plug your device in with <strong>both device buttons pressed</strong>.</p><p class="alert alert-info alert-withicon"><span class="glyphicon glyphicon-info-sign alert-icon"></span> For more information <a href=http://doc.satoshilabs.com/trezor-user/updatingfirmware.html target=_blank>see the user manual.</a></p></div></div><div ng-switch-when=device-bootloader><div class=modal-header><button type=button class=close title=Cancel ng-click=$dismiss()>&times;</button><h4 class=modal-title ng-if=(version)>Do you want to update the device firmware?</h4><h4 class=modal-title ng-if=!(version)>The device was plugged in a bootloader mode</h4></div><div class=modal-body><p ng-if=!(version)>You have plugged in a device in a bootloader mode. That is a special mode intended for updating the firmware. If you don\'t want to change the firmware, just unplug the device and plug it in again.</p><div class="alert alert-warning alert-withicon"><span class="glyphicon glyphicon-warning-sign alert-icon"></span><h4>Caution!</h4><p><strong>If your TREZOR is already initialized always have your Recovery seed with you before updating the firmware!</strong></p><p>In very rare cases, a firmware update might result in the need to recover the wallet from Recovery seed.</p><p><strong>For more information, <a href=http://doc.satoshilabs.com/trezor-user/updatingfirmware.html target=_blank>visit the user manual.</a></strong></p></div><div class=firmware-info><h5>Firmware info</h5><dl><dt ng-if=version>Current firmware:</dt><dd ng-if=version>{{version[0]}}.{{version[1]}}.{{version[2]}}</dd><dd ng-if=!(version)>(Current firmware version can\'t be determined in bootloader mode)</dd><dt ng-if=firmware>Available firmware:</dt><dd ng-if=firmware>{{firmware.version[0]}}.{{firmware.version[1]}}.{{firmware.version[2]}}</dd></dl><div ng-if=firmware.changelog><h5>Changelog</h5><p class=firmware-changelog>{{firmware.changelog}}</p></div><p ng-if=firmware.notes><a ng-href={{firmware.notes}} target=_blank>Read the full release notes</a></p></div></div><div class=modal-footer><a class="btn btn-link pull-left" href=mailto:support@bitcointrezor.com>Support needed?</a> <button type=button class="btn btn-primary" ng-click=update()>Yes, update</button> <button type=button class="btn btn-default" ng-if=!firmware.required ng-click=$close()>Cancel</button></div></div><div ng-switch-when=device-normal><div class=modal-header><button type=button class=close title=Cancel ng-click=$dismiss()>&times;</button><h4 class=modal-title>Your device firmware is outdated</h4></div><div class=modal-body><div class="alert alert-warning alert-withicon"><span class="glyphicon glyphicon-warning-sign alert-icon"></span><h4>Your TREZOR is not in the firmware update mode.</h4><p>Please reconnect it <strong>while pressing both buttons simultaneously.</strong></p></div></div><div class=modal-footer ng-if=!firmware.required><button type=button class="btn btn-default" ng-click=$close()>Cancel</button></div></div><div ng-switch-when=update-downloading><div class=modal-body><div class="alert alert-info text-center"><h4>Downloading firmware...</h4></div></div></div><div ng-switch-when=update-flashing><div class=modal-body><div class="alert alert-info text-center"><h4>Uploading firmware...</h4><p>If asked, please confirm the update on your device.</p></div></div></div><div ng-switch-when=update-check><div class=modal-body><div class="alert alert-info text-center"><h4>Please confirm the firmware fingerprint.</h4><p>Make sure the same fingerprint is displayed on the device screen.</p><div class=row><div class="col-md-6 col-md-offset-3"><samp class=samp-screen ng-if="firmware && firmware.fingerprint">{{firmware.fingerprint.substr(0, 16)}}<br>{{firmware.fingerprint.substr(16, 16)}}<br>{{firmware.fingerprint.substr(32, 16)}}<br>{{firmware.fingerprint.substr(48, 16)}}</samp></div></div></div></div></div><div ng-switch-when=update-success><div class=modal-body><div class="alert alert-success text-center"><h4>Update was successful</h4><p>Please unplug the device now.</p></div></div></div><div ng-switch-when=update-error><div class=modal-body><div class="alert alert-danger text-center"><h4>Update failed</h4><p>{{error}}</p></div></div></div></div>'), a.put("views/modal/forget.disconnected.html", '<ng-include src="\'views/modal/upperheader.html\'"></ng-include><div class=modal-header><h4 class=modal-title>Forget device?</h4></div><div class=modal-body><p>Would you like myTREZOR to forget your device or to remember it, so that it is still visible even while disconnected?</p><p class=text-muted>If you choose to remember the device, we will not ask you this question next time you disconnect the device.</p><p class=text-muted>Forgetting only removes the device from the list on the left, your bitcoins are still safe and you can access them by reconnecting your Trezor again.</p></div><div class=modal-footer><button type=button class="btn btn-default" ng-click="$close(\'remember\')">Remember</button> <button type=button class="btn btn-primary" ng-click="$close(\'forget\')">Forget</button></div>'), a.put("views/modal/forget.requested.html", '<ng-include src="\'views/modal/upperheader.html\'"></ng-include><div class=modal-header><h4 class=modal-title>Forget device?</h4></div><div class=modal-body><p>Do you want to forget your device?</p><p class=text-muted>Forgetting only removes the device from the list on the left, your bitcoins are still safe and you can access them by reconnecting your Trezor again.</p></div><div class=modal-footer><button type=button class="btn btn-default" ng-click="$close(\'dont-forget\')">Don\'t forget</button> <button type=button class="btn btn-primary" ng-click="$close(\'forget\')">Forget</button></div>'), a.put("views/modal/forget.wipe.html", '<ng-include src="\'views/modal/upperheader.html\'"></ng-include><div class=modal-header><h4 class=modal-title>Wipe finished</h4></div><div class=modal-body><p class="alert alert-success" ng-if=hideSuccessMsg>Your Trezor was successfully wiped.</p><p>Would you like myTREZOR to forget your old device with the old data or to remember it?</p></div><div class=modal-footer><button type=button class="btn btn-default" ng-click=$dismiss()>Remember</button> <button type=button class="btn btn-primary" ng-click=$close()>Forget (recommended)</button></div>'), a.put("views/modal/label.html", '<ng-include src="\'views/modal/upperheader.html\'"></ng-include><div class=modal-header><button type=button class=close title=Cancel ng-click=$dismiss()>&times;</button><h4 class=modal-title>Please enter the device label</h4></div><div class=modal-body><form class=form-inline ng-submit=$close(label)><div class=form-group><input class="form-control input-lg" size=20 autofocus placeholder={{device.DEFAULT_LABEL}} maxlength={{device.LABEL_MAX_LENGTH}} ng-model=label></div><div class=form-group><button type=submit class="btn btn-primary btn-lg">Change</button></div></form></div>'), a.put("views/modal/passphrase.html", '<ng-include src="\'views/modal/upperheader.html\'"></ng-include><div class=modal-header><button type=button class=close title=Cancel ng-click=$dismiss()>&times;</button><h4 class=modal-title>Please enter your passphrase</h4></div><div class=modal-body><form id=passphrase-form ng-init=installHandler()><div class=form-group><input class="form-control input-lg" size=12 autocomplete=off ng-model=values.passphrase ng-show=showPassphrase> <input type=password id=passphrase-input class="form-control input-lg" size=12 autofocus autocomplete=off ng-model=values.passphrase ng-hide=showPassphrase><div ng-show=check style="margin-top: -1px"><input class="form-control input-lg" size=12 autocomplete=off placeholder="Re-type for control" ng-model=values.passphraseCheck ng-show=showPassphrase> <input type=password class="form-control input-lg" size=12 autocomplete=off placeholder="Re-type for control" ng-model=values.passphraseCheck ng-hide=showPassphrase></div><span class=help-block>Note that passphrase is case-sensitive.</span></div><div class=form-group><div class=checkbox><label><input type=checkbox ng-model=showPassphrase ng-checked=false> Show passphrase</label></div></div><p class=text-danger ng-show="\n        check &&\n        values.passphrase &&\n        values.passphraseCheck &&\n        values.passphrase !== values.passphraseCheck">Passphrases do not match!</p><p class=text-danger ng-show="\n        values.passphrase.length > 50 ||\n        values.passphraseCheck.length > 50">Passphrase is too long!</p></form></div><div class=modal-footer><button type=button id=passphrase-submit class="btn btn-block btn-primary btn-lg" ng-disabled=!checkCorrect>Enter</button></div>'), a.put("views/modal/pin.html", '<ng-include src="\'views/modal/upperheader.html\'"></ng-include><form class=form-horizontal ng-submit=$close(pin) ng-controller=ModalPinCtrl><div class=modal-header><button type=button class=close title=Cancel ng-click=$dismiss()>&times;</button><h4 class=modal-title ng-switch=type><span ng-switch-when=PinMatrixRequestType_Current>Please enter current PIN:<br><small class=text-info>Look at the device for number positions.</small></span> <span ng-switch-when=PinMatrixRequestType_NewFirst>Please enter new PIN:<br><small class=text-info>Look at the device for number positions.</small></span> <span ng-switch-when=PinMatrixRequestType_NewSecond>Please re-enter new PIN:<br><small class=text-danger>Note that the positions of numbers shown on the device have changed!</small></span></h4></div><div class=modal-body><div class=pinmodal-dial><div class=form-group><span class=col-sm-4><button type=button class="btn btn-block btn-lg" ng-click=addPin(7)>&#9679;</button></span> <span class=col-sm-4><button type=button class="btn btn-block btn-lg" ng-click=addPin(8)>&#9679;</button></span> <span class=col-sm-4><button type=button class="btn btn-block btn-lg" ng-click=addPin(9)>&#9679;</button></span></div><div class=form-group><span class=col-sm-4><button type=button class="btn btn-block btn-lg" ng-click=addPin(4)>&#9679;</button></span> <span class=col-sm-4><button type=button class="btn btn-block btn-lg" ng-click=addPin(5)>&#9679;</button></span> <span class=col-sm-4><button type=button class="btn btn-block btn-lg" ng-click=addPin(6)>&#9679;</button></span></div><div class=form-group><span class=col-sm-4><button type=button class="btn btn-block btn-lg" ng-click=addPin(1)>&#9679;</button></span> <span class=col-sm-4><button type=button class="btn btn-block btn-lg" ng-click=addPin(2)>&#9679;</button></span> <span class=col-sm-4><button type=button class="btn btn-block btn-lg" ng-click=addPin(3)>&#9679;</button></span></div></div><div class=form-group><div class=pinmodal-pin><div class=pinmodal-pin-value>{{pin|password}}</div><button type=button class="btn btn-link btn-back" ng-click=delPin() ng-show=isPinSet()><span class=arrow></span> <span class="glyphicon glyphicon-remove"></span> <span class=sr-only>del</span></button></div><input type=hidden autocomplete=off ng-model=pin><div class=pinmodal-rating ng-if="pin && type !== \'PinMatrixRequestType_Current\'" ng-controller=DeviceCtrl ng-switch=ratePin(pin)><span ng-switch-when=long class=text-danger>Too Long</span> <span ng-switch-when=weak class=text-danger>Weak</span> <span ng-switch-when=fine class=text-warning>Fine</span> <span ng-switch-when=strong class=text-success>Strong</span> <span ng-switch-when=ultimate class=text-success>Ultimate</span></div></div></div><div class=modal-footer><button type=submit class="btn btn-primary btn-block btn-lg" ng-disabled="(ratePin(pin) === \'long\') || (pin.length === 0)">Enter</button><br><small class=text-muted>Lost? Check our <a href=http://doc.satoshilabs.com/trezor-user/enteringyourpin.html target=_blank>user manual</a>.</small></div></form>'), a.put("views/modal/qr.html", '<div class=modal-header><button type=button class=close title=Cancel ng-click=$dismiss()>&times;</button><h4 class=modal-title>Scan address from a QR code</h4></div><div class=modal-body><qr-scan width=600 height=335 success=$close(data)></qr-scan></div><div class=modal-footer><button type=button class="btn btn-default pull-left" ng-click=$dismiss()>Cancel</button></div>'), a.put("views/modal/setup.html", '<ng-include src="\'views/modal/upperheader.html\'"></ng-include><div class=modal-header><h4 class=modal-title>Recovery seed setup</h4></div><div class=modal-body ng-switch=stage><div ng-switch-when=writeFirst class="alert alert-block alert-info"><p>We will now show you {{recoveryWords}} words that will allow you to recover your accounts in case you lose your device. <strong>Please write down all these words carefully.</strong></p><hr><h4>Please write down the {{recoveryCurrentWord | ordinal}} word of your recovery seed.</h4></div><div ng-switch-when=write class="alert alert-block alert-info"><h4>Please write down the {{recoveryCurrentWord | ordinal}} word of your recovery seed.</h4></div><div ng-switch-when=checkFirst class="alert alert-block alert-info"><p>We will now show you the {{recoveryWords}} words again. <strong>Please check carefully that you wrote them down correctly.</strong></p><hr><h4>Please check the {{recoveryCurrentWord | ordinal}} word of your recovery seed.</h4></div><div ng-switch-when=check class="alert alert-block alert-info"><h4>Please check the {{recoveryCurrentWord | ordinal}} word of your recovery seed.</h4></div></div>'), a.put("views/modal/udev.html", '<div class=modal-header><button type=button class=close title=Cancel ng-click=$dismiss()>&times;</button><h4 class=modal-title>Udev TREZOR setup</h4></div><div class=modal-body><p>On Linux, you will need to run the following command.</p><pre class=autoselect ng-click=autoselect()>sudo wget https://raw.githubusercontent.com/trezor/trezor-common/master/udev/23-trezor.rules -O /usr/lib/udev/rules.d/23-trezor.rules &amp;&amp; sudo cp /usr/lib/udev/rules.d/23-trezor.rules /lib/udev/rules.d/23-trezor.rules </pre><p>After running it, disconnect your TREZOR and then connect it again.</p><p>If there are any sight of troubles, <a href=mailto:support@bitcointrezor.com>contact our support</a>.</p></div><div class=modal-footer><button type=button class="btn btn-default btn-primary" ng-click=$dismiss()>OK</button></div>'), a.put("views/modal/upperheader.html", '<div class=modal-upper-header><p><span class=glyphicon-trezor></span> {{device.isEmpty() ? "New device setup" : device.label()}}</p></div>'), a.put("views/nav.html", '<ul class="nav nav-devices" ng-controller=NavCtrl><li ng-repeat="device in devices()" ng-class="{ disabled: device.isLoading() }"><a ng-href=#/device/{{device.id}} ng-class="{ active: isActive(\'/device/{{device.id}}\')\n                           &&\n                           !( isActive(\'/device/{{device.id}}/account\')) }"><h4>{{device.label()}}</h4><small class=dev-status><span class=dev-status-{{device.status()}} ng-switch=device.status()><span ng-switch-when=loading><div class="loading-img loading-img-left"></div>Loading&hellip;</span> <span ng-switch-when=connected><span class="glyphicon glyphicon-check"></span> Connected</span> <span ng-switch-when=disconnected><span class="glyphicon glyphicon-unchecked"></span> Disconnected</span></span></small></a> <a href="" class="dev-forget close" tooltip="Forget this device" tooltip-placement=bottom tooltip-append-to-body=true tooltip-trigger=mouseenter ng-click=forget(device) ng-if=!(device.isLoading())><span class="glyphicon glyphicon-trash" aria-hidden=true></span></a> <a href="" class="dev-lock close" tooltip-html-unsafe="Lock this device<br>(automatically {{device.timeToClear()}})" tooltip-placement=bottom tooltip-append-to-body=true tooltip-trigger=mouseenter ng-click=device.clearSession() ng-if=device.displayLock()><span class=glyphicon-lock aria-hidden=true></span></a><div class="dev-slowdiscovery tooltip in top" ng-show=device.discoveryIsSlow()><div class=tooltip-inner>Still loading, just a moment&hellip;</div><div class=tooltip-arrow></div></div><div class="dev-blocked tooltip tooltip-danger in right" ng-show=device.error><div class=tooltip-inner ng-switch=device.error><span ng-switch-when="Opening device failed">Device could not be opened. Make sure you don\'t have myTREZOR running in another tab or browser window!</span> <span ng-switch-default>{{device.error}}</span></div><div class=tooltip-arrow></div></div><ul class="nav nav-devices-accounts"><li ng-repeat="account in device.accounts" ng-class="{ disabled: account.isLoading() }"><a ng-href="{{ accountLink(device, account)}}" ng-class="{ active: isActive(\'/device/{{device.id}}/account/{{account.id}}\') }">{{account.label()}} <small class=dev-acc-info><span ng-if=!(account.isLoading())>({{account.balance | amount}} {{account.coin.coin_shortcut}})</span> <span ng-if=account.isStreamError() class="pull-right text-danger"><span class="glyphicon glyphicon-warning-sign"></span> Offline</span></small></a></li></ul><div ng-if=!device.isEmpty()><div ng-if=!device.canAddAccount() tooltip="\n             To add accounts, make sure your device is connected\n             and the last account is not empty." tooltip-placement=bottom><a ng-href="" class="btn btn-sm" disabled><span class="glyphicon glyphicon-plus"></span> Add account</a></div><div ng-if=device.canAddAccount()><a ng-href="" class="btn btn-sm" ng-click=addAccount(device) ng-disabled=addingInProgress><span class="glyphicon glyphicon-plus"></span> Add account</a></div></div><hr ng-hide=$last></li></ul>'), a.put("views/topBars.html", '<div ng-controller=FirmwareCtrl><div class="alert alert-warning alertbar" ng-if=optionalFirmware><div class=container><strong>New TREZOR firmware is available.</strong> Upgrade for the newest features and bug fixes. <button class="btn btn-sm btn-warning" ng-click=optionalFirmware.update()>Show details</button></div></div></div><div ng-controller=BackendInfoCtrl><div class="alert alert-danger alertbar" ng-if=isStreamError()><div class=container><strong>Our server is undergoing maintenance.</strong> Your bitcoins are safe and you will be able to access them in a moment. <a href=http://satoshilabs.com/lp/oops>For more information, please see our status page.</a></div></div></div>')
    }]);