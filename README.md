# devq-dashboard
Displays DoneDone issues in a Kanban style view

## Usage
Create a `config.json` file structured like so:  

```json
{
    "subdomain": "coolcompany",
    "username": "jimbob",
    "apikey": "greatpassword",
    "company": "Cool Company",
    "filter": "Cool Company Queue",
    "colours": [
        {"bg": "#f1c40f", "fg": "rgba(0,0,0,.75)"},
        {"bg": "#2ecc71", "fg": "rgba(0,0,0,.75)"},
        {"bg": "#3498db", "fg": "rgba(0,0,0,.75)"},
        {"bg": "#9b59b6", "fg": "rgba(0,0,0,.75)"},
        {"bg": "#34495e", "fg": "rgba(0,0,0,.75)"},
        {"bg": "#e67e22", "fg": "rgba(0,0,0,.75)"},
        {"bg": "#e74c3c", "fg": "rgba(0,0,0,.75)"},
        {"bg": "#1abc9c", "fg": "rgba(0,0,0,.75)"},
        {"bg": "#d35400", "fg": "rgba(0,0,0,.75)"},
        {"bg": "#27ae60", "fg": "rgba(0,0,0,.75)"}
    ],
    "people": {
        "devs": [
            "Jim Bob",
            "Dave Brave",
            "Adam Madam",
            "Stu Brew",
            "Tim Pim"
        ],
        "ams": [
            "Jack Sprat",
            "James Brames"
        ]
    }
}
```

Run `npm install`, then `gulp`.