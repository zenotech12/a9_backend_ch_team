<template>
  <div>
    <el-input readonly :placeholder="$t('sys.selectAddress')" v-model="allAddress">
      <el-button slot="append" icon="el-icon-edit-outline" @click="showMap"></el-button>
      <!--<i slot="suffix" class="el-input__icon el-icon-edit" style="cursor: pointer" @click="showMap"></i>-->
    </el-input>
    <el-dialog :title="$t('sys.addressChoose')" :visible.sync="dialogFormVisible" :close-on-click-modal="false" append-to-body width="80%" class="mapCss" center style="margin-top: -7vh">
      <el-row>
        <el-col :span="24" class="map">
          <div class="search">
            <input :placeholder="$t('sys.keywordSearch')" class="keyWord" id="suggestId">
          </div>
          <!--<div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>-->
          <div id="allmap" style="width: 100%;"></div>
            <el-row class="map_footer">
              <el-col :span="8" class="styleInput">
                <span class="xinhao">{{$t('sys.province')}}：</span><el-input v-model="form.province" :placeholder="$t('sys.province')" clearable></el-input>
              </el-col>
              <el-col :span="8">
                <span class="xinhao">{{$t('sys.city')}}：</span><el-input v-model="form.city" :placeholder="$t('sys.city')" clearable></el-input>
              </el-col>
              <el-col :span="8">
                <span class="xinhao">{{$t('sys.district')}}：</span><el-input v-model="form.area" :placeholder="$t('sys.district')" clearable></el-input>
              </el-col>
              <el-col :span="8">
                <span class="xinhao">{{$t('sys.addr')}}：</span><el-input v-model="form.address" :placeholder="$t('sys.addr')" clearable></el-input>
              </el-col>
              <el-col :span="8">
                <span class="xinhao">{{$t('sys.lng')}}：</span>
                <el-input v-model="form.lon" :placeholder="$t('sys.lng')" clearable></el-input>
              </el-col>
              <el-col :span="8">
                <span class="xinhao">{{$t('sys.lat')}}：</span>
                <el-input v-model="form.lat" :placeholder="$t('sys.lat')" clearable></el-input>
              </el-col>
            </el-row>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('tools.cancel')}}</el-button>
        <el-button type="primary" @click="submit">{{$t('tools.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // import google from 'google'
  export default {
    name: 'mapSelector',
    data() {
      return {
        form: {
          province: '',
          city: '',
          area: '',
          address: '',
          lon: '',
          lat: ''
        },
        allAddress: '',
        placeShow: false,
        dialogFormVisible: false,
        lngtxt: 104.917445,
        lattxt: 11.558831,
        // lngtxt: 116.403765,
        // lattxt: 39.914850,
        addresstxt: 'Phnom Penh',
        map: null,
        marker: '',
        infowindow: '',
        geocoder: '',
        markersArray: []
      }
    },
    model: {
      prop: 'formCity',
      event: 'addressChange'
    },
    props: {
      formCity: {
        type: Object,
        default: function() {
          return {}
        }
      }
    },
    watch: {
      formCity: {
        handler(val) {
          // console.log('ddd', val)
          if (val !== null) {
            // console.log('val', val)
            this.allAddress = val.province + ' ' + val.city + ' ' + val.area + ' ' + val.address + '(' + val.lon + ', ' + val.lat + ')'
            this.form = JSON.parse(JSON.stringify(val))
            this.lngtxt = this.form.lon
            this.lattxt = this.form.lat
            this.addresstxt = this.form.address
          }
        },
        immediate: true
      }
    },
    methods: {
      reast() {
        this.form.province = ''
        this.form.city = ''
        this.form.area = ''
        this.form.address = ''
        this.form.lon = ''
        this.form.lat = ''
      },
      showMap() {
        const currentLang = this.$store.state.app.lang
        let lang = navigator.language || navigator.userLanguage
        lang = lang.substr(0, 2).toLowerCase()
        if (lang === 'zh' && currentLang === 'zh') {
          this.$message.error(this.$t('sys.googleMapError'))
          return
        }
        this.dialogFormVisible = true
        if (!document.getElementById('allmap')) {
          this.$nextTick(res => {
            // this.setiInit()
            this.map = this.mapFunc()
            var latlng = new google.maps.LatLng(this.lattxt, this.lngtxt)
            this.marker = new google.maps.Marker({
              position: latlng,
              map: this.map
            })
            this.markersArray.push(this.marker)
            this.attachSecretMessage(this.marker, latlng, this.addresstxt)
            this.initAutocomplete()
          })
        }
      },
      initAutocomplete() {
        // 监听点击地图事件
        const that = this
        const geocoder = new google.maps.Geocoder() // 实例化地址解析
        google.maps.event.addListener(this.map, 'click', function(event) {
          const location = event.latLng
          if (that.marker) {
            that.marker.setMap(null)
            that.clearOverlays(that.infowindow) // 清除地图中的标记
            that.reast()
          }
          that.marker = new google.maps.Marker({
            position: location,
            map: that.map
          })
          that.markersArray.push(that.marker)
          // 根据经纬度获取地址
          if (geocoder) {
            geocoder.geocode({
              'location': location
            }, function(results, status) {
              if (status === google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                  console.log('resulte', results[0])
                  results[0].address_components.forEach(item => {
                    if (item.types.includes('sublocality') || item.types.includes('neighborhood') || item.types.includes('administrative_area_level_3')) {
                      that.form.area = item.long_name
                    } else if (item.types.includes('locality') || item.types.includes('administrative_area_level_2')) {
                      that.form.city = item.long_name
                    } else if (item.types.includes('administrative_area_level_1')) {
                      that.form.province = item.long_name
                    }
                  })
                  that.form.lon = results[0].geometry.location.lng()
                  that.form.lat = results[0].geometry.location.lat()
                  that.form.address = results[0].formatted_address
                  if (that.form.city === '' && that.form.province !== '') {
                    that.form.city = that.form.province
                  }
                  // console.log('marker', that.marker)
                  that.attachSecretMessage(that.marker, results[0].geometry.location, results[0].formatted_address)
                }
              } else {
                alert('Geocoder failed due to: ' + status)
              }
            })
          }
        })

        var input = document.getElementById('suggestId')
        // console.log('v', input)
        var searchBox = new google.maps.places.SearchBox(input)
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)
        var markers = []
        // console.log('searchBox', searchBox.addListener('places_changed'))
        searchBox.addListener('places_changed', function() {
          console.log('marker2', that.marker)
          console.log('event', event)
          // debugger
          if (that.marker) {
            that.marker.setMap(null) // 清空搜索后的标点位置
          }
          var places = searchBox.getPlaces()
          console.log('places', places[0])
          that.reast()
          if (places.length === 0) {
            return
          } else if (places[0]) { // 将选择的地址赋值
            const latlng1 = new google.maps.LatLng(places[0].geometry.location.lat(), places[0].geometry.location.lng())
            that.marker = new google.maps.Marker({
              position: latlng1,
              map: that.map
            })
            // console.log('resulte', results[0])
            places[0].address_components.forEach(item => {
              if (item.types.includes('sublocality') || item.types.includes('sublocality_level_1') || item.types.includes('neighborhood') || item.types.includes('administrative_area_level_3')) {
                that.form.area = item.long_name
              } else if (item.types.includes('locality') || item.types.includes('administrative_area_level_2')) {
                that.form.city = item.long_name
              } else if (item.types.includes('administrative_area_level_1')) {
                that.form.province = item.long_name
              }
            })
            if (that.form.city === '' && that.form.province !== '') {
              that.form.city = that.form.province
            }
            that.form.lon = places[0].geometry.location.lng()
            that.form.lat = places[0].geometry.location.lat()
            that.form.address = places[0].formatted_address
            that.attachSecretMessage(that.marker, places[0].geometry.location, places[0].formatted_address)
          }
          console.log('markers', markers)

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds()
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log('Returned place contains no geometry')
              return
            }
            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          })
          that.map.fitBounds(bounds)
          // marker.setMap(null)
        })
      },
      attachSecretMessage(marker, piont, address) {
        var message = '<b>' + this.$t('sys.coordinate') + ':</b>' + piont.lat() + ' , ' + piont.lng() + '<br />' + '<b>' + this.$t('sys.address1') + ':</b>' + address
        this.infowindow = new google.maps.InfoWindow({
          content: message,
          size: new google.maps.Size(50, 50)
        })
        this.infowindow.open(this.map, this.marker)
      },
      clearOverlays(infowindow) {
        if (this.markersArray && this.markersArray.length > 0) {
          for (var i = 0; i < this.markersArray.length; i++) {
            this.markersArray[i].setMap(null)
          }
          this.markersArray.length = 0
        }
        if (infowindow) {
          infowindow.close()
        }
      },
      mapFunc() {
        var latlng = new google.maps.LatLng(this.lattxt, this.lngtxt)
        const myOptions = {
          zoom: 12,
          center: latlng,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true
        }
        const map = new google.maps.Map(document.getElementById('allmap'), myOptions)
        return map
      },
      submit() {
        this.allAddress = this.form.province + this.form.city + this.form.area + this.form.address + '(' + this.form.lon + ',' + this.form.lat + ')'
        this.$emit('addressChange', this.form)
        this.dialogFormVisible = false
      }
    },
    mounted() {
    }
  }
</script>

<style lang="scss">
  .coutryard-map {
    width: 100%;
    height: 400px;
    &>div:last-child{
      display: none;
    }
  }
  .xinhao:before{
    content: '*';
    color: red;
  }
  .mapCss{
    .el-dialog--center .el-dialog__body {
      padding: 0 20px;
    }
  }
  .map .search {
    width: 500px;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 1000;
  }

  #allmap {
    width: 100%;
    height: 600px;
    overflow: hidden;
    margin: 0;
    font-family: "微软雅黑";
  }
  .map {
    position: relative;
  }
  .coutryard-map {
    width: 100%;
    height: 100%;
  }
  .submit{
    padding: 5px 20px;
    margin: 0;
    box-sizing: border-box;
    border: 1px solid #ccc;
    cursor: pointer;
    background: #fff;
    outline: none;
  }
  .keyWord{
    height: 24px;
    margin-top: 18px;
    margin-left: 20px;
    width: 200px;
  }
  .map_footer {
    line-height: 28px;
  }
  .pac-container {
    z-index: 3000;
  }
</style>
