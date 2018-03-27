# **Storytelling Visualization**

##### Sean Schaffer

------

## News Article 

### [*2017 safest year on record for commercial passenger air travel: groups*](https://www.reuters.com/article/us-aviation-safety/2017-safest-year-on-record-for-commercial-passenger-air-travel-groups-idUSKBN1EQ17L)

> ##### A news article from Reuters explaining how 2017 was "the safest year on record for commercial air travel" explaining that "Airlines recorded zero accident deaths in commercial passenger jets".

## DataSet 

### [Aviation Data and Documentation from the NTSB Accident Database System](https://catalog.data.gov/dataset/aviation-data-and-documentation-from-the-ntsb-accident-database-system)

> ##### Dataset with detailed information on plane crashes by the National Transportation Safety Board in XML format.
>
> ##### Converted to JSON with the python script `convert_to_json.py`
>
> ##### Used Jupyter Lab to Filter and Clean Dataset
>
> - ###### Filtered non-letal crashes
>
> - ###### Filtered incomplete and missing data
>
> - ###### Filtered data before 2000's
>
> - ###### Added in Airport Latitude and Longitude with `global_airports.csv` [dataset](https://old.datahub.io/dataset/global-airports)

## Visualization 

### [Fatal Plane Crashes Visualized](https://sschneaky.github.io/visualizing_plane_crashes/story.html)

> ### **Visualization choices**
>
> #### 3D Globe
>
> > ##### I chose a `d3.geoOrthographic()` projection to represent the world as a globe so that the nature of a plane flight could be shown in a more accurate representation. I also used a sky\_box technique and drew the midpoint of the flight on the skybox, so that a 3D effect of the flight could be seen. 
>
> ### 
>
> ### **Interaction choices**
>
> ### Drag
>
> > ##### By nature we cannot see all of a globe at once so being able to change the viewing angle is very important. I implemented a drag feature so that the viewer can drag the globe to the other side.
>
> ### Zoom and Pan
>
> > Zoom
>
> ### Filters
>
> > ##### The article had stated that 2017 in particular was a safe year for commercial aviation and I wanted to be able to visualize a specific situation. With the filters, the viewer actively select scenarios and interact visually with the dataset. 
> >
> > ##### The Article discusses United States Commercial Jets in 2017, and if we use all of those filters in 2017, we can see that there are no crashes on the map.
>
> ### Click
>
> > ##### Selecting a crash line will propagate a box at the bottom left with a link to the NTSB website with the correct eventID. This enable the user to select a crash and find out all the details of the fight and what went wrong.
>
> 
>
> ### **Design choices**
>
> ### Material Design 
>
> > ##### I like it.
>
> ### Color
>
> > ##### I wanted to emphasize the crashes by having them be the only colored element 



## Extra Credit

> - ##### Implemented Scroll Zooming on the Globe  
>
> - ##### Formatted report using Markdown and Custom Styling

## 

## 