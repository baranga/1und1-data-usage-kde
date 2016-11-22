import QtQuick 2.0
import QtQuick.Layouts 1.1
import org.kde.plasma.plasmoid 2.0
import org.kde.plasma.core 2.0 as PlasmaCore
import org.kde.plasma.components 2.0 as PlasmaComponents
import '../code/logic.js' as Logic

Item {
  id: main

  property bool freshData: false

  Plasmoid.preferredRepresentation: Plasmoid.fullRepresentation

  Layout.fillHeight: true
  Layout.fillWidth: false
  Layout.minimumWidth: display.width
  Layout.maximumWidth: display.width

  PlasmaComponents.Label {
    id: display
    text: "n/a"

    height: main.height
    width: display.paintedWidth

    font {
      pixelSize: 1024
      pointSize: 1024
    }

    fontSizeMode: Text.VerticalFit
    wrapMode: Text.NoWrap

    horizontalAlignment: Text.AlignHCenter
    verticalAlignment: Text.AlignVCenter
  }
  MouseArea {
    anchors.fill: parent
    hoverEnabled: true
    onClicked: {
      Qt.openUrlExternally('https://center.vodafone.de/vfcenter/index.html?browser=web')
    }
  }

  PlasmaCore.ToolTipArea {
    id: tooltip
    anchors.fill: parent
    active: true
    visible: true
  }

  property var runner;

  function update() {
    runner.update(function (err) {
      if (err) {
        main.freshData = false
        return
      }

      main.freshData = true
      render()

      plasmoid.configuration.lastData = JSON.stringify(runner.data)
    })
  }

  function render() {
    display.text = runner.renderRelUsageText(
      plasmoid.configuration.decimalPrecision,
      plasmoid.configuration.showPercentageSign
    )
    tooltip.mainText = runner.renderCombinedUsageText()

    if (!main.freshData && plasmoid.configuration.showStaleIndicator) {
      display.text += '*'
    }
  }

  Timer {
    id: timer
    interval: plasmoid.configuration.updateInterval * 1000
    running: false
    repeat: true
    onTriggered: update()
  }

  Connections {
    target: plasmoid.configuration
    onUpdateIntervalChanged: {
      timer.interval = plasmoid.configuration.updateInterval * 1000
    }
    onShowPercentageSignChanged: render()
    onShowStaleIndicatorChanged: render()
    onDecimalPrecisionChanged: render()
  }

  Component.onCompleted: {

    var lastData
    if (plasmoid.configuration.lastData) {
      lastData = JSON.parse(plasmoid.configuration.lastData)
    }
    runner = new Logic.Runner(lastData)

    render()

    update()
    timer.start()
  }
}
