import QtQuick 2.0
import QtQuick.XmlListModel 2.0
import org.kde.plasma.plasmoid 2.0
import org.kde.plasma.components 2.0 as PlasmaComponents
import '../code/logic.js' as Logic

Item {
  PlasmaComponents.Label {
    id: display
    text: "1und1 Data Counter"
  }

  Timer {
    id: timer
    interval: 2500
    running: false
    repeat: true
    onTriggered: Logic.update(display)
  }

  Component.onCompleted: {
    Logic.init(display)
    timer.start()
  }
}
