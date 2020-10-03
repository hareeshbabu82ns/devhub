## DevHub-Loader
#### various loaders for scraping and loading data into app

## Loaders
### Entity Content Loader
* `entity_content_loader.py`
* usage
```sh
$> python entity_content_loader.py -i "./data/gods.json" -u "http://localhost:8000/graphql/" -k "SecretKey"
```
* sample content format 
  (Note: `type` field is optional to default parent - God, entity - Stotram, content - Slokam)
```json
{
        "parent": {
            "text": "Hanuman",
            "type": "God",
            "textData": {
                "TEL": {
                    "text": "హనుమాన్"
                },
                "SAN": {
                    "text": "हनुमान्"
                }
            }
        },
        "entity": {
            "text": "Hanuman Chalisa (Tulsidas)",
            "type": "Stotram",
            "textData": {
                "TEL": {
                    "text": "హనుమాన్ చాలీసా (తులసీదాస కృతం)"
                },
                "SAN": {
                    "text": "हनुमान चालीसा"
                }
            }
        },
        "contents": {
            "type": "Slokam",
            "TEL": {
                "language": "TEL",
                "title": "హనుమాన్ చాలీసా (తులసీదాస కృతం)",
                "category": "హనుమాన్",
                "contents": [
                    "దోహా-\nశ్రీ గురు చరణ సరోజ రజ \nనిజమన ముకుర సుధారి\nవరణౌ రఘువర విమల యశ \nజో దాయక ఫలచారి ||",
                ]
            }
        }
    }
```
## Scrapers (not for re-publishing purposes, only for personal use)

### Stotra Nidhi web scraper
* gathers content from [stotra nidhi](https://stotranidhi.com/)
* usage
```sh
$> python scrape_stotra_nidhi.py -o "./data" -u "https://stotranidhi.com/sri-anjaneya-dandakam-in-telugu/" -f
```