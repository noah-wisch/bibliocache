package com.theironyard.datamodels;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


/**
 * Created by kelseynewman on 2/10/17.
 */
@JsonIgnoreProperties(ignoreUnknown = true)//indicates that any properties not bound in this type should be ignored.
public class Volume {

    private VolumeInfo volumeInfo;

    public Volume() {
    }

    public Volume(VolumeInfo volumeInfo) {
        this.volumeInfo = volumeInfo;
    }

    public VolumeInfo getVolumeInfo() {
        return volumeInfo;
    }

    public void setVolumeInfo(VolumeInfo volumeInfo) {
        this.volumeInfo = volumeInfo;
    }

    @Override
    public String toString() {
        return "Volume{" +
                "volumeInfo=" + volumeInfo +
                '}';
    }

}
