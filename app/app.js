const app = new Vue({
    el: '#app',
    data: {
        scenes: [],
        sc2InGameScene: '',
        sc2OutOfGameScene: '',
        sc2ReplayScene: '',
        alert: false,
        darkTheme: true,
    },
    methods: {
        save: function() {
            streamlabs.userSettings.set('in_game_scene', this.sc2InGameScene);
            streamlabs.userSettings.set('out_of_game_scene', this.sc2OutOfGameScene);
            streamlabs.userSettings.set('replay_scene', this.sc2ReplayScene);
            this.alert = true;
            setTimeout(() => {
                this.alert = false;
            }, 2000);
        },
        cancel: function() {
            streamlabs.userSettings.getAll()
            .then(settings => {
                this.sc2InGameScene = settings['in_game_scene'];
                this.sc2OutOfGameScene = settings['out_of_game_scene'];
                this.sc2ReplayScene = settings['replay_scene'];        
            })
            .catch(err => {
                console.log(err);
            });
        },
        toggleTheme: function() {
            this.darkTheme = !this.darkTheme;
            streamlabs.userSettings.set('dark_theme', this.darkTheme);
        },
        openRelease: function() {
            streamlabsOBS.v1.External.openExternalLink('https://github.com/tso/sc2-auto-scene-switcher/releases/tag/v0.0.9');
        },
    }
});


const streamlabs = window.Streamlabs;
const streamlabsOBS = window.streamlabsOBS;
streamlabs.init({ receiveEvents: true })
    .then(data => {
        return streamlabs.userSettings.getAll()
    }).then(settings => {
        app.sc2InGameScene = settings['in_game_scene'];
        app.sc2OutOfGameScene = settings['out_of_game_scene'];
        app.sc2ReplayScene = settings['replay_scene'];
        app.darkTheme = settings['dark_theme']
    }).then(() => {
        return streamlabsOBS.apiReady
    }).then(() => {
        return streamlabsOBS.v1.Scenes.getScenes()
    }).then(scenes => {
        app.scenes = scenes;
        setInterval(() => {
            fetch("http://127.0.0.1:6118/ui")
                .then(data => { return data.json() })
                .then(res => {
                    if (res['activeScreens'].length) {
                        streamlabsOBS.v1.Scenes.makeSceneActive(sceneNameToId(scenes, app.sc2OutOfGameScene));
                    } else {
                        fetch("http://127.0.0.1:6118/game")
                            .then(data => { return data.json() })
                            .then(res => {
                                if (res['isReplay']) {
                                    streamlabsOBS.v1.Scenes.makeSceneActive(sceneNameToId(scenes, app.sc2ReplayScene));
                                } else {
                                    streamlabsOBS.v1.Scenes.makeSceneActive(sceneNameToId(scenes, app.sc2InGameScene));
                                }
                            });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }, 1500);
    })

const sceneNameToId = (scenes, name) => {
    for (var scene of scenes) {
        if (scene['name'] == name) {
            return scene['id'];
        }
    }

    return null;
}
