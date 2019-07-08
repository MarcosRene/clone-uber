import React, { Component, Fragment } from 'react';
import { View, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getPixelSize } from '../../utils';
import Geocoder from 'react-native-geocoding'; 

import Search from '..Search/';
import Directions from '../Directions';
import Datails from '../Datails';
import markerImage from '../../assets/marker.png';
import backImage from '../../assets/back.png';

import {
    Back,
    LocationBox,
    LocationText, 
    LocationTimeBox, 
    LocationTimeTextSmall
} from './styles';

Geocoder.init('AIzaSyBDS8x1Bm0u_qwW5aIWg7TR9VTsAUAKQLE');

export default class Map extends Component{
    state = {
        region: null,
        destination: null,
        duration: null,
        location: null
    };

    async componentDidMount() {
        navigator.geolocation.getCurrentPosition(
          async  ({ coords: {latitude, longitude} }) => {
                const response  = await Geocoder.from({ latitude, longitude });
                const address = response.results[0].formatted_address;
                const location = address.substring(0, address.indexOff(','));

                this.setState({
                    location,
                    region:{
                        latitude: -5.0994539,
                        longitude: -38.3335485,
                        latitudeDelta: 0.0143,
                        longitudeDelta: 0.0134
                    }
                });
            },
            () => {},
            {
                timeout: 2000,
                enableHighAccuracy: true,
                maximumAge: 1000,
            }
        )
    }

    handleLocationSelected = (data, {geometry}) => {
        const { location: {lat: latitude, lng: longitude} } = geometry;

        this.setState({
            destination: {
                latitude,
                longitude,
                title: data_structured_formatting.main_text,
            },
        })
    }

    handleBack = () => {
        this.setState({ destination: null });
    }

    render() {
        const { region, destination, duration, location } = this.state;
        return(
            <View style={{ flex: 1 }}>
                <MapView
                    style={{ flex: 1 }}
                    region={region}
                    showsUserLocation
                    loadingEnabled
                    ref={el => this.mapView = el}
                >
                    {destination && (
                        <Fragment>
                            <Directions
                                origin={origin}
                                destination={destination}
                                onRead={result => {
                                    this.setState({
                                        duration: Math.floor(result.duration)
                                    });
                                    this.mapView.fitToCoordinates(result.coordinates,{
                                        edgePadding: {
                                            right: getPixelSize(50),
                                            left: getPixelSize(50),
                                            top: getPixelSize(50),
                                            bottom: getPixelSize(350),
                                        }
                                    });
                                }}
                            />

                            <Marker
                                coordinate={destination}
                                anchor={{ x: 0, y: 0 }}
                                image={markerImage}
                            >
                                <LocationBox>
                                    <LocationText>{destination.title}</LocationText>
                                </LocationBox>
                            </Marker>
                            <Marker
                                coordinate={region}
                                anchor={{ x: 0, y: 0 }}
                            >
                                <LocationBox>
                                    <LocationTimeBox>
                                        <LocationTimeText>{duration}</LocationTimeText>
                                        <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                                    </LocationTimeBox>
                                    <LocationText>{location}</LocationText>
                                </LocationBox>
                            </Marker>
                        </Fragment>
                    )}
                </MapView>

                { destination ? (
                    <Fragment>
                        <Back onPress={this.handleBack}>
                            <Image source={backImage}/>
                        </Back>
                        <Datails />
                    </Fragment>
                ) : ( 
                    <Search onLocationSelected={this.handleLocationSelected} /> 
                )}
                                
            </View>
        )
    }
}