# Inital Data

## Templates

```mongodb
db.subjecttemplates.insertMany([
    {
        name: "How",
        pattern: "How {subject} {be} {name}?",
        placeholders: [
            "{subject}",
            "{be}",
            "{name}"
        ]
    }
    {
        name: "HowLikelyWillYou",
        pattern: "How likely will you {subject} {name}?",
        placeholders: [
            "{subject}",
            "{name}"
        ]
    },
    {
        name: "HowGood",
        pattern: "How good {be} {name} {subject}?",
        placeholders: [
            "{be}",
            "{name}",
            "{subject}"
        ]
    }
]);
```

## Tags

```mongodb
db.tags.insertMany([
    {
        text: 'attitude'
    },
    {
        text: 'personal'
    }]
);
```

## Subjects

```mongodb
db.subjects.insertMany([
    {
        text: 'kind',
        icon: '/assets/kind.png',
        template: ObjectId("5ed4726a39835a8733b3304b"),
        tags: [
            ObjectId("5ed47bb739835a8733b3304e"),
            ObjectId("5ed47bb739835a8733b3304f")
        ]
    },
    {
        text: 'romantic',
        icon: '/assets/romantic.png',
        template: ObjectId("5ed4726a39835a8733b3304b"),
        tags: [
            ObjectId("5ed47bb739835a8733b3304e"),
            ObjectId("5ed47bb739835a8733b3304f")
        ]
    },
    {
        text: 'brave',
        icon: '/assets/brave.png',
        template: ObjectId("5ed4726a39835a8733b3304b"),
        tags: [
            ObjectId("5ed47bb739835a8733b3304e"),
            ObjectId("5ed47bb739835a8733b3304f")
        ]
    },
    {
        text: 'lovely',
        icon: '/assets/lovely.png',
        template: ObjectId("5ed4726a39835a8733b3304b"),
        tags: [
            ObjectId("5ed47bb739835a8733b3304e"),
            ObjectId("5ed47bb739835a8733b3304f")
        ]
    },
    {
        text: 'sexy',
        icon: '/assets/sexy.png',
        template: ObjectId("5ed4726a39835a8733b3304b"),
        tags: [
            ObjectId("5ed47bb739835a8733b3304e"),
            ObjectId("5ed47bb739835a8733b3304f")
        ]
    },
    {
        text: 'tidy',
        icon: '/assets/tidy.png',
        template: ObjectId("5ed4726a39835a8733b3304b"),
        tags: [
            ObjectId("5ed47bb739835a8733b3304e"),
            ObjectId("5ed47bb739835a8733b3304f")
        ]
    }]
);
```