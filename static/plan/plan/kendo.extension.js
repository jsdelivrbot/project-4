kendo.ui.GanttMonthDayView = kendo.ui.GanttView.extend({
    name: "monthday",

    options: {
        resizeTooltipFormat: "dddd, MMM d, yyyy"
    },

    range: function (range) {
        this.start = kendo.date.firstDayOfMonth(range.start);
        this.end = kendo.date.addDays(kendo.date.getDate(kendo.date.lastDayOfMonth(range.end)), 1);
    },

    _createSlots: function () {
        var slots = [];

        slots.push(this._months(this.start, this.end));
        slots.push(this._days(this.start, this.end));

        return slots;
    },

    _layout: function () {
        var rows = [];
        var options = this.options;

        rows.push(this._slotHeaders(this._slots[0], kendo.template(options.monthHeaderTemplate)));
        rows.push(this._slotHeaders(this._slots[1], kendo.template(options.dayHeaderTemplate)));

        return rows;
    }
});
kendo.ui.GanttView1 = kendo.ui.GanttYearView.extend({
    name: "view1",

    options: {
        yearHeaderTemplate: "#=kendo.toString(start, 'yyyy')#",
        monthHeaderTemplate: "#=kendo.toString(start, 'MM')#",
        slotSize: 30
    }
});
kendo.ui.GanttView2 = kendo.ui.GanttYearView.extend({
    name: "view2",

    options: {
        yearHeaderTemplate: "#=kendo.toString(start, 'yyyy')#",
        monthHeaderTemplate: "#=kendo.toString(start, 'MMM')#",
        slotSize: 60
    }
});
kendo.ui.GanttView4 = kendo.ui.GanttYearView.extend({
    name: "view4",

    options: {
        yearHeaderTemplate: "#=kendo.toString(start, 'yyyy')#",
        monthHeaderTemplate: "#=kendo.toString(start, 'MMMM')#",
        slotSize: 120
    }
});
kendo.ui.GanttView8 = kendo.ui.GanttMonthView.extend({
    name: "view8",

    options: {
        weekHeaderTemplate: "#=kendo.toString(start, 'dd')# - #=kendo.toString(kendo.date.addDays(end, -1), 'dd')#",
        monthHeaderTemplate: "#=kendo.toString(start, 'MMMM, yyyy')#",
        slotSize: 56
    }
});
kendo.ui.GanttView16 = kendo.ui.GanttMonthView.extend({
    name: "view16",

    options: {
        weekHeaderTemplate: "#=kendo.toString(start, 'M/dd')# - #=kendo.toString(kendo.date.addDays(end, -1), 'M/dd')#",
        monthHeaderTemplate: "#=kendo.toString(start, 'MMMM, yyyy')#",
        slotSize: 112
    }
});
kendo.ui.GanttView32 = kendo.ui.GanttMonthDayView.extend({
    name: "view32",

    options: {
        dayHeaderTemplate: kendo.template("#=kendo.toString(start, 'dd')#"),
        monthHeaderTemplate: "#=kendo.toString(start, 'MMMM, yyyy')#",
        slotSize: 32
    }
});
//kendo.ui.GanttView32 = kendo.ui.GanttWeekView.extend({
//    name: "view32",

//    options: {
//        dayHeaderTemplate: kendo.template("#=kendo.toString(start, 'dd')#"),
//        weekHeaderTemplate: "#=kendo.toString(start, 'M/dd')# - #=kendo.toString(kendo.date.addDays(end, -1), 'M/dd')#",
//        slotSize: 32
//    }
//});
kendo.ui.GanttView64 = kendo.ui.GanttWeekView.extend({
    name: "view64",

    options: {
        dayHeaderTemplate: kendo.template("#=kendo.toString(start, 'dd')#"),
        weekHeaderTemplate: "#=kendo.toString(start, 'M/dd')# - #=kendo.toString(kendo.date.addDays(end, -1), 'M/dd')#",
        slotSize: 64
    }
});
