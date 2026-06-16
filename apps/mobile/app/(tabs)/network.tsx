import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Dimensions,
} from 'react-native';

import Svg, {
  Circle,
  Line,
  Polygon,
  Text as SvgText,
} from 'react-native-svg';

import api from '../../services/api';

export default function EndorsementNetworkScreen() {
  const [connections, setConnections] =
    useState<any[]>([]);

  const [nodes, setNodes] =
    useState<any[]>([]);

  const [ranking, setRanking] =
    useState<any[]>([]);

  useEffect(() => {
    loadNetwork();
  }, []);

  const loadNetwork = async () => {
    try {
      const networkResponse =
        await api.get(
          '/endorsements/network'
        );

      setConnections(
        networkResponse.data.connections || []
      );

      setNodes(
        networkResponse.data.nodes || []
      );

      const influenceResponse =
        await api.get(
          '/endorsements/influence'
        );

      setRanking(
        influenceResponse.data || []
      );

    } catch (error) {
      console.log(error);
    }
  };

  const users = useMemo(() => {
    return [
      ...new Set(
        connections.flatMap(
          connection => [
            connection.source,
            connection.target,
          ]
        )
      ),
    ];
  }, [connections]);

  const screenWidth =
  Dimensions.get('window').width;

  const nodeCount =
    Math.max(users.length, 1);

  const radius =
    Math.max(
      120,
      nodeCount * 35
    );

  const svgWidth =
    Math.max(
      screenWidth - 40,
      radius * 2 + 250
    );

  const svgHeight =
    Math.max(
      500,
      radius * 2 + 250
    );

  const centerX =
    svgWidth / 2;

  const centerY =
    svgHeight / 2;

  const positions =
    users.reduce(
      (acc, user, index) => {
        const angle =
          (index / users.length) *
          Math.PI *
          2;

        acc[user] = {
          x:
            centerX +
            radius *
              Math.cos(angle),

          y:
            centerY +
            radius *
              Math.sin(angle),
        };

        return acc;
      },
      {} as Record<
        string,
        { x: number; y: number }
      >
    );
  
  const trustMap =
    nodes.reduce(
        (acc, node) => {
        acc[node.name] =
            node.trustScore;

        return acc;
        },
        {} as Record<
          string,
          number
        >
    );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#F5F7FB',
      }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 12,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            marginBottom: 20,
          }}
        >
          Endorsement Network
        </Text>

        {users.length === 0 ? (
          <View
            style={{
              backgroundColor:
                'white',
              padding: 24,
              borderRadius: 16,
            }}
          >
            <Text>
              No endorsement data
              found.
            </Text>
          </View>
        ) : (
          <View
            style={{
              backgroundColor:
                'white',
              borderRadius: 20,
              padding: 8,
            }}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator
            >
              <Svg
                width={svgWidth}
                height={svgHeight}
              >

                {/* Connections */}

                {connections.map((connection, index) => {
                  const source =
                    positions[connection.source];

                  const target =
                    positions[connection.target];

                  const angle = Math.atan2(
                    target.y - source.y,
                    target.x - source.x
                  );

                  const nodeRadius = 30;

                  const endX =
                    target.x -
                    nodeRadius * Math.cos(angle);

                  const endY =
                    target.y -
                    nodeRadius * Math.sin(angle);

                  const arrowLength = 12;
                  const arrowWidth = 6;

                  const arrowPoint1 = {
                    x:
                    endX -
                    arrowLength * Math.cos(angle) +
                    arrowWidth * Math.sin(angle),  

                    y:
                    endY -
                    arrowLength * Math.sin(angle) -
                    arrowWidth * Math.cos(angle),
                  };

                  const arrowPoint2 = {
                    x:
                    endX -
                    arrowLength * Math.cos(angle) -
                    arrowWidth * Math.sin(angle),  

                    y:
                    endY -
                    arrowLength * Math.sin(angle) +
                    arrowWidth * Math.cos(angle),
                  };

                  return (
                    <React.Fragment key={index}>
                      <Line
                        x1={source.x}
                        y1={source.y}
                        x2={endX}
                        y2={endY}
                        stroke="#6B7280"
                        strokeWidth="2"
                      />

                      <Polygon
                        points={`
                          ${endX},${endY}
                          ${arrowPoint1.x},${arrowPoint1.y}
                          ${arrowPoint2.x},${arrowPoint2.y}
                        `}
                        fill="#6B7280"
                      />
                    </React.Fragment>
                  );
                })}

                {/* Nodes */}

                {users.map(user => (
                  <React.Fragment
                    key={user}
                  >
                    <Circle
                      cx={
                        positions[
                          user
                        ].x
                      }
                      cy={
                        positions[
                          user
                        ].y
                      }
                      r={
                        Math.max(
                          28,
                          Math.min(
                            30 +
                            (trustMap[user] || 0) / 3,
                            55
                          )
                        )
                      }
                      fill={
                        (trustMap[user] || 0) >= 20
                          ? '#16A34A'
                          : '#2563EB'
                      }
                    />

                    <SvgText
                      x={
                        positions[
                          user
                        ].x
                      }
                      y={
                        positions[
                          user
                        ].y + 5
                      }
                      textAnchor="middle"
                      fill="white"
                      fontSize={
                        user.length > 10
                          ? 10
                          : 14
                      }
                    >
                      {user}
                    </SvgText>
                    <SvgText
                      x={positions[user].x}
                      y={positions[user].y + 45}
                      textAnchor="middle"
                      fontSize="12"
                    >
                      Trust: {trustMap[user] || 0}
                    </SvgText>
                  </React.Fragment>
                ))}
              </Svg>
            </ScrollView>

            <View
              style={{
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontWeight:
                    'bold',
                  marginBottom: 10,
                }}
              >
                Network Stats
              </Text>

              <Text>
                Users: {users.length}
              </Text>

              <Text>
                Endorsements:{' '}
                {
                  connections.length
                }
              </Text>
            </View>
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 16,
                marginTop: 20,
              }}
              >
              <Text
                style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 15,
                }}
              >
                🏆 Influence Ranking
              </Text>

              {ranking.map(
                (item, index) => (
                  <View
                    key={item.user}
                    style={{
                      flexDirection: 'row',
                      justifyContent:
                        'space-between',
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight:
                        index < 3
                          ? '600'
                          : 'normal',
                      }}
                    >
                      {index === 0 && '🥇 '}
                      {index === 1 && '🥈 '}
                      {index === 2 && '🥉 '}
                      #{index + 1} {item.user}
                    </Text>

                    <Text>
                      {item.influenceScore}
                    </Text>
                  </View>
                )
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}