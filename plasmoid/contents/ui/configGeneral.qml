import QtQuick 2.0
import QtQuick.Controls 1.0 as QtControls
import QtQuick.Layouts 1.0 as QtLayouts

Item {
    id: iconsPage
    width: childrenRect.width
    height: childrenRect.height
    implicitWidth: mainColumn.implicitWidth
    implicitHeight: pageColumn.implicitHeight

    property alias cfg_updateInterval: updateIntervalSpinBox.value
    property alias cfg_decimalPrecision: decimalPrecisionSpinBox.value
    property alias cfg_showPercentageSign: showPercentageSignCheckBox.checked
    property alias cfg_showStaleIndicator: showStaleIndicatorCheckBox.checked

    QtLayouts.ColumnLayout {
        QtLayouts.GridLayout {
            columns: 2

            QtControls.Label {
                text: i18n("Update interval in seconds")
            }
            QtControls.SpinBox {
                id: updateIntervalSpinBox
                minimumValue: 1
                maximumValue: 600
                stepSize: 1
                value: plasmoid.configuration.updateInterval
            }

            QtControls.Label {
                text: i18n("Decimal precision")
            }
            QtControls.SpinBox {
                id: decimalPrecisionSpinBox
                minimumValue: 0
                maximumValue: 2
                stepSize: 1
                value: plasmoid.configuration.decimalPrecision
            }
        }
        QtLayouts.ColumnLayout {
            QtControls.CheckBox {
                id: showPercentageSignCheckBox
                text: i18n("Show percentage sign")
            }
            QtControls.CheckBox {
                id: showStaleIndicatorCheckBox
                text: i18n("Show stale indicator")
            }
        }
    }

    Component.onCompleted: {
    }
}
