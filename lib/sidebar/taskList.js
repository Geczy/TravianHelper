TravianHelper.TaskList = function(game) {
    this.game = game;
    this.village_id = TravianHelper.Utils.getCurrentVillageID();
    this.tasks = localStorage.getItem('taskList');

    this.initialize();
}

TravianHelper.TaskList.prototype = {

    initialize: function() {
        if (this.tasks != undefined && this.tasks.length > 0) {
            this.tasks = JSON.parse(this.tasks);
        } else {
            this.tasks = {};
        }
    },

    getForVillage: function(village_id) {
        if (village_id == false) {
            village_id = this.village_id;
        }

        if (this.tasks[village_id] != undefined && this.tasks[village_id].length > 0) {
            return this.tasks[village_id];
        } else {
            return false;
        }
    },

    addTask: function(village_id, task_id) {
        if (village_id == false) {
            village_id = this.village_id;
        }

        if (!this.tasks[village_id]) {
            return this.tasks[village_id] = [task_id];
        }

        return this.tasks[village_id].push(task_id);
    },

    remove: function(village_id, task_id) {
        if (village_id == false) {
            village_id = this.village_id;
        }

        for (var i = 0; i < this.tasks[village_id].length; i++) {
            if (this.getForVillage(village_id)[i] == task_id) {
                return this.getForVillage(village_id).splice(i, 1);
            }
        };

        return false;
    },

    save: function() {
        localStorage.setItem('taskList', JSON.stringify(this.tasks));
    }
};