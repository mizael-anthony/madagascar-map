const express = require('express')
const axios = require('axios')
const cors = require('cors')
const fs = require('fs')

const NOMINATUM = "https://nominatim.openstreetmap.org/search.php?city=Tsaralalana&country=Madagascar&polygon_geojson=1&format=jsonv2"
const PORT = process.env.PORT || 5001
const app = express()

app.use(express.json())
app.use(cors())

/**
 * @description Api jules
 */

app.get('/api.mapgasy.file/:quarter_name', (req, res)=>{
    let { quarter_name } = req.params
    let quarter_list = []
    try{
        const file = fs.readFileSync('data/data.csv', 'utf-8')

        // Split via Regex
        const lines = file.split(/\r?\n/)


        lines.forEach(line => {
            let place = line.replace(/['"]+/g, '').split(";")

            if(place[1].includes(quarter_name)){
                let [id, quartier, commune, district, region, province] = place
                quarter_list.push({
                    id,
                    quartier,
                    commune,
                    district,
                    region,
                    province
                })
            }
        })


        if(quarter_list.length != 0){
            res.json(quarter_list)
        }
        else{
            res.json({"détail":"Veuillez saisir un endroit qui existe ."})
        }





    }
    catch(error){
        console.log(error)

    }



})


/**
 * @description Récupérer Lieux dans le monde entier Via Nominatim
 */
 app.get('/api.mapgasy.geo/:quarter_name', (req, res)=>{
    let { quarter_name } = req.params
    let country = "Madagascar"
    if (quarter_name.length < 4) return res.status(404).json({ "détail": "Veuillez saisir 4 caractères au minimum." })

    let quarter_list = []
    axios.get(`https://nominatim.openstreetmap.org/search.php?city=${quarter_name}&country=${country}&polygon_geojson=1&format=jsonv2`)
        .then(result => {
            result.data.forEach(element => {
                // Récupération adresse quartier, commune, region, province en une seule ligne
                let adresse = element.display_name
                let latitude = element.lat
                let longitude = element.lon

                quarter_list.push({
                    adresse,
                    latitude,
                    longitude,                    
                })
                
            });

            if(quarter_list.length != 0){
                res.json(quarter_list)
            }
            else{
                res.status(404).json({"détail":"Veuillez saisir un endroit qui existe ."})
            }
        })
        .catch(error => console.log(error))


})



/**
 * @description Récupérer Lieux dans le monde entier Via Nominatim
 */
app.get('/api.mapgasy.nominatum/:quarter_name', (req, res)=>{
    let { quarter_name } = req.params
    let country = "Madagascar"
    if (quarter_name.length < 4) return res.status(404).json({ "détail": "Veuillez saisir 4 caractères au minimum." })

    let quarter_list = []
    axios.get(`https://nominatim.openstreetmap.org/search.php?city=${quarter_name}&country=${country}&polygon_geojson=1&format=jsonv2`)
        .then(result => {
            result.data.forEach(element => {
                let place = element.display_name

                // Conversion en tableau
                place = place.split(',')

                // Vérifier la taille du tableau pour avoir les bons données
                if(place.length <= 6){
                    let [quartier, commune, region, province] = place
                    
                    // Supprimer tous les espaces
                    province = province.trim()
                    region = region.trim()
                    commune = commune.trim()
                    quartier = quartier.trim()
    
                    quarter_list.push({
                        province,
                        region,
                        commune,
                        quartier
                        
                    })
                }
                
            });

            if(quarter_list.length != 0){
                res.json(quarter_list)
            }
            else{
                res.status(404).json({"détail":"Veuillez saisir un endroit qui existe ."})
            }
        })
        .catch(error => console.log(error))


})

/**
 * @description Lancement du serveur
 */
app.listen(PORT, (req, res) => {
    console.log(`Server is listenning to port ${PORT}`)

})
