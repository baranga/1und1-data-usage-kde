import QtQuick 2.0
import QtQuick.Controls 1.0 as QtControls
import QtQuick.Layouts 1.0 as QtLayouts

Item {
    id: iconsPage
    width: childrenRect.width
    height: childrenRect.height
    implicitWidth: mainColumn.implicitWidth
    implicitHeight: pageColumn.implicitHeight

    property alias cfg_updateInterval: updateIntervalField.value

    QtLayouts.GridLayout {
        columns: 2

        QtControls.Label {
          text: "Update interval (sec)"
        }
        QtControls.SpinBox {
          id: updateIntervalField
          minimumValue: 1
          maximumValue: 600
          stepSize: 1
          value: plasmoid.configuration.updateInterval
        }
    }

    Component.onCompleted: {
      //updateIntervalField.value = plasmoid.configuration.updateInterval
      //updateIntervalField.value = 60
    }
}
