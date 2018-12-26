const app = new Vue({
    el: '#app',
    data: {
        scenes: [],
        sc2InGameScene: '',
        sc2OutOfGameScene: '',
        sc2ReplayScene: '',
        alert: false,
    },
    methods: {
        save: function () {
            streamlabs.userSettings.set('in_game_scene', this.sc2InGameScene);
            streamlabs.userSettings.set('out_of_game_scene', this.sc2OutOfGameScene);
            streamlabs.userSettings.set('replay_scene', this.sc2ReplayScene);
            app.alert = true;
            setTimeout(() => {
                app.alert = false;
            }, 2000);
        }
    }
});


const streamlabs = window.Streamlabs;
const streamlabsOBS = window.streamlabsOBS;
streamlabs.init({ receiveEvents: true })
    .then(data => {
        console.log('streamlabs initialized');
        return streamlabs.userSettings.getAll()
    }).then(settings => {
        console.log('settings', settings);
        app.sc2InGameScene = settings['in_game_scene'];
        app.sc2OutOfGameScene = settings['out_of_game_scene'];
        app.sc2ReplayScene = settings['replay_scene'];
    }).then(() => {
        return streamlabsOBS.apiReady
    }).then(() => {
        console.log('streamlabs obs api ready');
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
